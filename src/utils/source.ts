import { formatDuration as fd, intervalToDuration } from 'date-fns';

export const normalizeTrackNo = (trackNo?: number) =>
  trackNo ? String(trackNo).padStart(2, '0') : undefined;

/**
 * 格式化时长
 * @param duration 时长，单位为毫米
 */
export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 1000 / 60);
  const seconds = Math.floor((duration / 1000) % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

interface ComputeDurationOptions {
  format: 'HH:mm:ss' | 'HH:mm' | 'mm:ss';
}

/**
 * 计算时长
 * @param milliseconds 时长，单位为毫米
 * @param expression 格式化表达式
 */
export const computeDuration = (
  milliseconds: number,
  options: ComputeDurationOptions = { format: 'HH:mm' },
) => {
  const format = [];

  if (options.format.includes('HH')) {
    format.push('hours');
  }

  if (options.format.includes('mm')) {
    format.push('minutes');
  }

  if (options.format.includes('ss')) {
    format.push('seconds');
  }

  const duration = intervalToDuration({ start: 0, end: milliseconds });
  const text = fd(duration, { format });

  return {
    ...duration,
    text,
  };
};
