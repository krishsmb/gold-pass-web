import { Pipe, PipeTransform } from '@angular/core';
// import * as decodeEmoji from 'encoder.js'
/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *  value | capitalizefirst
 * Example:
 *  // value.name = daniel
 *  {{ value.name | capitalizefirst  }}
 *  fromats to: Daniel
*/
declare var decodeEmoji :any;
@Pipe({
  name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (value === null) return '';
    return typeof decodeEmoji === "function" && decodeEmoji(value);
    // return value;
  }
}