export class Carousel {
   grid: ILayoutTiles;
   slide?: number;
   speed?: number;
   interval?: number;
   animation?: Animate;
   point?: boolean;
   type?: string;
   load?: number;
   custom?: Custom;
   loop?: boolean;
   easing?: string;
   touch?: any;
   dynamicLength: boolean;
}

export class ILayoutTiles {
   xs: number;
   sm: number;
   md: number;
   lg: number;
   all: number;
}

export type Custom = 'tile';
export type Animate = 'lazy';
