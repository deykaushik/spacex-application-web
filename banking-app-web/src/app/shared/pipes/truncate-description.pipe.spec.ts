import { TruncateDescriptionPipe } from './truncate-description.pipe';
import { Constants } from '../../core/utils/constants';

describe('TruncateDescriptionPipe', () => {
  const charLimit = Constants.truncateDescCharLimit.charLimit;
  const truncateLimit = Constants.truncateDescCharLimit.truncateLimit;
  const mockDescriptionMoreThan25Char = 'Description to be truncated if greater than 25 characters';
  const mockDescriptionLessThan25Char = 'Do not truncate';
  let pipe: TruncateDescriptionPipe;

  beforeEach(() => {
    pipe = new TruncateDescriptionPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the truncated value of supplied description', () => {
    const transformedResult = pipe.transform(mockDescriptionMoreThan25Char, truncateLimit);
    expect(mockDescriptionMoreThan25Char.length).toBeGreaterThan(charLimit);
    expect(transformedResult).toBe(mockDescriptionMoreThan25Char.slice(0, truncateLimit) + '...');
  });

  it('should return the description as it is if maxlength is less than 25 characters', () => {
    const transformedResult = pipe.transform(mockDescriptionLessThan25Char, truncateLimit);
    expect(mockDescriptionLessThan25Char.length).toBeLessThan(charLimit);
    expect(transformedResult).toBe(mockDescriptionLessThan25Char);
  });
});
