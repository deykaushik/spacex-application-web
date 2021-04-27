import { Component, ViewChild, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { ITransactionDetail } from '../../../core/services/models';
import * as moment from 'moment';
import { Moment } from 'moment';
import { AmountTransformPipe } from '../../pipes/amount-transform.pipe';
import { Constants } from '../../../core/utils/constants';
import { BaseChartDirective } from 'ng2-charts';
import { CommonUtility } from '../../../core/utils/common';

interface IBalaceInfo {
   y: number;
   t: Date;
   amount: number;
}

@Component({
   selector: 'app-transaction-graph',
   templateUrl: './transaction-graph.component.html',
   styleUrls: ['./transaction-graph.component.scss']
})
export class TransactionGraphComponent implements OnInit, OnChanges, OnDestroy {
   @Input() accountType: string;
   @Input() containerName: string;
   @Input() transactions: ITransactionDetail[];
   @Input() currency: string;
   @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
   graphData: IBalaceInfo[];
   startDate = moment(new Date()).add('week', -6).toDate();
   endDate = new Date();
   amountTransform = new AmountTransformPipe();

   lineChartData: Array<any> = [{
      data: this.transactions,
      fill: false,
      lineTension: 0
   }];

   lineChartOptions: any = {
      animation: {
         duration: 10
      },
      layout: {
         padding: {
            top: 50,
            left: 5
         }
      },
      scales: {
         yAxes: [{
            ticks: {
               // Binded the context of the component to graph since,
               // the currency on the graph's Y axis should change to either 'MR'/'GB' in case of rewards.
               userCallback: this.formatAmount.bind(this),
               fontSize: 10,
               fontColor: '#808080',
               fontFamily: Constants.chartFontFamily.markpro,
            },
            gridLines: {
               borderDash: [5, 2],
               zeroLineBorderDash: [0]
            }
         }],
         xAxes: [
            {
               type: 'time',
               time: {
                  unit: 'week',
                  stepSize: 1,
                  displayFormats: {
                     week: 'MMM D',
                  },
                  min: this.startDate,
                  max: this.endDate
               },
               ticks: {
                  fontSize: 10,
                  fontColor: '#808080',
                  fontFamily: Constants.chartFontFamily.markpro,
               },
               gridLines: {
                  display: false,
                  drawBorder: false
               }
            }]
      },
      elements: {
         point: {
            radius: 0,
            hitRadius: 0,
            hoverRadius: 0
         }
      },
      title: {
         display: false
      },
      tooltips: {
         enabled: false
      },
      legend: {
         display: false
      }
   };

   lineChartColors: Array<any> = [{
      borderColor: 'rgba(0,0,0,0)'
   }];

   chartLineColor: string;
   constructor() { }

   ngOnInit() {
      this.addHoverEvent();
   }

   public getAccountTypeYLabel(accountType: string) {
      let label: string;
      switch (accountType) {
         case 'CA':
         case 'SA':
            label = 'Available balance';
            break;
         case 'CC':
            label = 'Current balance';
            break;
         case 'NC':
         case 'IS':
         case 'HL':
            label = 'Outstanding balance';
            break;
         case 'TD':
         case 'DS':
         case 'INV':
            label = 'Market value';
            break;
         case Constants.labels.dashboardRewardsAccountTitle:
            label = 'Balance';
            break;
         default:
            label = 'Current balance';
      }
      return label;
   }

   public getAccountTypeFillColor(accountType: string, containerName?: string) {
      let fillColor: string;
      switch (accountType) {
         case 'SA':
            fillColor = 'rgba(0,0,0,0)';
            if (containerName === 'ClubAccount') {
               fillColor = 'rgba(28, 188, 236, 0.07)';
            }
            break;
         case 'NC':
         case 'IS':
         case 'HL':
            fillColor = 'rgba(242, 169, 0, 0.07)';
            break;
         case 'TD':
         case 'DS':
         case 'INV':
            fillColor = 'rgba(28, 188, 236, 0.07)';
            break;
         case Constants.labels.dashboardRewardsAccountTitle:
            fillColor = 'rgba(242, 169, 0, 0.07)';
            break;
         default:
            fillColor = 'rgba(0,0,0,0)';
      }
      return fillColor;
   }

   addHoverEvent() {

      const _this = this;
      const parentEventHandler = Chart.Controller.prototype.eventHandler;
      Chart.Controller.prototype.eventHandler = function (event) {
         this.clear();
         this.draw();
         _this.plotHoverOverData(this.chartArea, this.height, this.ctx, event.x);
         return parentEventHandler.apply(this, arguments);
      };

      this.lineChartOptions.animation.onComplete = function () {
         const chart = _this.chartComponent.chart;
         _this.plotHoverOverData(chart.chartArea, chart.height, chart.ctx, chart.chartArea.right);
      };
   }

   ngOnDestroy() {
      Chart.Controller.prototype.eventHandler = () => { };
   }

   ngOnChanges() {
      this.parseChartDuration();
      this.parseChartData();
      this.plotLine();
   }

   plotHoverOverData(chartArea: { left: number, right: number }, chartHeight: number, context: CanvasRenderingContext2D, hoverX: any) {

      const x = Math.min(Math.max(hoverX, chartArea.left), chartArea.right);

      context.beginPath();
      context.moveTo(x, 40);
      context.strokeStyle = '#ccc';
      context.lineWidth = 2;
      context.lineTo(x, chartHeight - 20);
      context.stroke();

      const dateSteps = (this.endDate.getTime() - this.startDate.getTime())
         / (chartArea.right - chartArea.left);
      const dateOffset = (x - chartArea.left) * dateSteps;
      const newDate = new Date(this.startDate.getTime() + dateOffset);
      const items = this.graphData.filter(g => {
         return g.t.getTime() <= newDate.getTime();
      });

      let transforemdValue = this.currency ? this.currency + '0' : 'R0';
      if (items.length > 0) {
         const item = items[items.length - 1];
         if (item.y) {
            transforemdValue = (item.y < 0 ? '-' : '')
               + this.amountTransform.transform(item.y.toString(), { prefixValue: this.currency });
         }
      }

      context.font = '10px ' + Constants.chartFontFamily.markpro;
      const dateText = moment(newDate).format('ddd D MMM, YYYY');
      const dateTextWidth = context.measureText(dateText).width;

      context.font = '14px ' + Constants.chartFontFamily.markproMedium;
      context.fillStyle = '#808080';

      const amountTextWidth = context.measureText(transforemdValue).width;
      const yLabel = this.getAccountTypeYLabel(this.accountType);
      const labelWidth = context.measureText(yLabel).width;

      const chartWidth = chartArea.right - chartArea.left;
      const offset = ((x - chartArea.left) / chartWidth) * Math.max(amountTextWidth, dateTextWidth);
      context.fillText(transforemdValue, x - offset + 5, 35);
      if (x - offset > labelWidth) {
         context.fillText(yLabel, 0, 35);
      }

      context.font = '10px ' + Constants.chartFontFamily.markpro;
      context.fillStyle = '#bbb';
      context.fillText(dateText, x - offset, 15);
   }

   parseChartData() {
      const tempData: IBalaceInfo[] = [];
      this.transactions.forEach(transaction => {
         const date = new Date(transaction.PostedDate);
         if (tempData.length >= 1) {
            const prevTrans = tempData[tempData.length - 1];
            const prevDate = prevTrans.t;
            if (date.getTime() - prevDate.getTime() > 86400000) {
               tempData.push({
                  y: prevTrans.y,
                  t: new Date(date.getTime() - 86400000),
                  amount: 0
               });
            }
         }

         let transactionOverwritten = false;
         if (tempData.length > 0) {
            const lastTrans = tempData[tempData.length - 1];
            if (date.getTime() - lastTrans.t.getTime() < 86400000 && date.getDate() === lastTrans.t.getDate()) {
               tempData[tempData.length - 1] = {
                  y: transaction.RunningBalance,
                  t: date,
                  amount: transaction.Amount + tempData[tempData.length - 1].amount
               };
               transactionOverwritten = true;
            }
         }
         if (!transactionOverwritten) {
            tempData.push({
               y: transaction.RunningBalance,
               t: date,
               amount: transaction.Amount
            });
         }
      });

      const smallerItem = tempData.find(graphItem => {
         return graphItem.t < this.startDate;
      });

      const firstVisibleTransaction = tempData.find(graphItem => {
         return graphItem.t >= this.startDate;
      });

      if (!smallerItem) {
         tempData.splice(0, 0, {
            y: (firstVisibleTransaction ? firstVisibleTransaction.y - firstVisibleTransaction.amount : 0),
            t: moment(this.startDate).add('day', -1).toDate(),
            amount: 0
         });

         if (firstVisibleTransaction && firstVisibleTransaction.t.getTime()
            - moment(this.startDate).add('day', -1).toDate().getTime() > 86400000) {
            tempData.splice(1, 0, {
               y: (firstVisibleTransaction ? firstVisibleTransaction.y - firstVisibleTransaction.amount : 0),
               t: moment(firstVisibleTransaction.t).add('day', -1).toDate(),
               amount: 0
            });
         }
      }

      const lastItem = tempData[tempData.length - 1];
      tempData.push({
         y: lastItem.y,
         t: moment(new Date()).add(1, 'day').toDate(),
         amount: 0
      });
      this.graphData = tempData;
   }

   parseChartLineColor() {
      const accountStyle = CommonUtility.getAccountTypeStyle(this.accountType, this.containerName);
      let graphColor: string = null;
      switch (accountStyle) {
         case Constants.accountTypeCssClasses.current:
            graphColor = '#009d39';
            break;
         case Constants.accountTypeCssClasses.savings:
            graphColor = '#009639';
            break;
         case Constants.accountTypeCssClasses.clubAccount:
            graphColor = '#00b2a9';
            break;
         case Constants.accountTypeCssClasses.creditCard:
            graphColor = '#d22630';
            break;
         case Constants.accountTypeCssClasses.loan:
            graphColor = '#f2a900';
            break;
         case Constants.accountTypeCssClasses.investment:
            graphColor = '#00b2a9';
            break;
         case Constants.accountTypeCssClasses.foreign:
            graphColor = '#00b2a9';
            break;
         case Constants.accountTypeCssClasses.rewards:
            graphColor = '#f2a900';
            break;
         case Constants.accountTypeCssClasses.other:
            graphColor = '#979797';
            break;
      }
      this.chartLineColor = graphColor;
   }

   parseChartDuration() {

      let isWeeklyGraph = true;
      let graphDuration = 6;

      switch (this.accountType) {
         case 'NC':
         case 'IS':
         case 'HL':
         case 'TD':
         case 'DS':
         case 'INV':
            isWeeklyGraph = false;
            graphDuration = 3;
            break;
      }

      this.endDate = new Date();
      this.startDate = moment(new Date()).add((isWeeklyGraph ? 'week' : 'month'), -graphDuration).toDate();
   }

   plotLine() {
      this.lineChartOptions.scales.xAxes[0].time.min = this.startDate;
      this.lineChartData = [{
         data: this.graphData,
         lineTension: .12,
         borderWidth: 2,
         borderColor: 'rgba(0,0,0,0)'
      }];

      this.parseChartLineColor();

      if (this.chartComponent && this.chartComponent.chart) {
         const chart: any = this.chartComponent.chart;
         chart.options.scales.xAxes[0].time.min = this.startDate;
         chart.data.datasets[0].borderColor = this.chartLineColor;
         chart.data.datasets[0].backgroundColor = this.getAccountTypeFillColor(this.accountType, this.containerName);
         chart.update();
      }
   }

   formatAmount(value: number): string {
      const absoluteValue = Math.abs(value);
      const currency = this.currency || 'R';
      let displayValue = absoluteValue.toString();
      if (absoluteValue >= 1000000000) {
         displayValue = (absoluteValue / 1000000000).toFixed(1) + 'b';
      } else if (absoluteValue >= 1000000) {
         displayValue = (absoluteValue / 1000000).toFixed(1) + 'm';
      } else if (absoluteValue >= 1000) {
         displayValue = (absoluteValue / 1000).toFixed(1) + 'k';
      } else {
         displayValue = absoluteValue.toFixed(1);
      }
      displayValue = displayValue.replace('.0', '');
      return (value < 0 ? ('-' + currency) : currency) + displayValue + ' ';
   }
}
