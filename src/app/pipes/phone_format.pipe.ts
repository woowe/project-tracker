import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'phone_format'})
export class PhoneFormatPipe implements PipeTransform {
  transform(phone) {
    if(phone !== null) {
      return phone.toString().replace(/(\d{3})(\d{3})(\d{4})(x?)(\d*)/, '($1) $2-$3 $4 $5').trim();
    }
    return null;
  }
}
