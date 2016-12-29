import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'is_product'})
export class IsProductPipe implements PipeTransform {
  transform(product, alt, i) {
    // console.log("PRODUCT PIPE", product);
    if(product !== null) {
      // return phone.toString().replace(/(\d{3})(\d{3})(\d{4})(x?)(\d*)/, '($1) $2-$3 $4 $5').trim();
      return product.type === alt;
    }
    return null;
  }
}
