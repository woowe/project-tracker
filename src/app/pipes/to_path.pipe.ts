import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'to_path'})
export class ToPathPipe implements PipeTransform {
  transform(text: string, begining: string, end: string) {
    if(text !== null && typeof text === "string") {
      if (text === "Inventory+") {
        text = "inventory-plus";
      }
      text = text.replace(" ", "-").trim();
      text = text.toLowerCase();
      return begining + text + end;
    }
    return null;
  }
}
