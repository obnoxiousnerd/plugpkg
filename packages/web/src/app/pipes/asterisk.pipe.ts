import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asterisk',
})
export class AsteriskPipe implements PipeTransform {
  /**
   * Outputs every character in stars.
   * @example "foobar" | asterisk => "******"
   */
  transform(value: string): string {
    if (!value) return;
    const asteriskedVal = [];
    for (let i = 0; i < value.length; i++) asteriskedVal[i] = '*';
    return asteriskedVal.join('');
  }
}
