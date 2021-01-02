import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEaux'
})
export class FilterEauxPipe implements PipeTransform {

  transform(array: any): any {
    return array.filter((item)=>{
        return item.type == 'eaux';
    })
 }

}
