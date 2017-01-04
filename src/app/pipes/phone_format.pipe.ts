import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'phone_format'})
export class PhoneFormatPipe implements PipeTransform {
  transform(phone, extension) {
    if(phone !== null && extension === true) {
      return phone.toString().replace(/(\d{3})(\d{3})(\d{4})(x?)(\d*)/, '($1) $2-$3 $4 $5').trim();
    } else if(phone !== null && extension === false) {
      return phone.toString().replace(/(\d{3})(\d{3})(\d{4})(x?)(\d*)/, '($1) $2-$3').trim();
    }
    return null;
  }
}
