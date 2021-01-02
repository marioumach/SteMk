import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAutre'
})
export class FilterAutrePipe implements PipeTransform {
  transform(array: any): any {
    return array.filter((item)=>{
        return item.type == 'autre';
    })
 }

}
