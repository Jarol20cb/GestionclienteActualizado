import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null || value < 0) {
      return 'N/A';
    }

    const days = Math.floor(value / (24 * 3600));
    const hours = Math.floor((value % (24 * 3600)) / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.floor(value % 60);

    let durationStr = '';
    if (days > 0) {
      durationStr += `${days}d `;
    }
    if (hours > 0) {
      durationStr += `${hours}h `;
    }
    if (minutes > 0) {
      durationStr += `${minutes}m `;
    }
    if (seconds > 0 || durationStr === '') {
      durationStr += `${seconds}s`;
    }

    return durationStr.trim();
  }

}
