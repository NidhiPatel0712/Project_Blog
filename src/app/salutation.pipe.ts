import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salutation'
})
export class SalutationPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if(args == "male" || args == undefined)
      return "Mr." + value;
    if(args == "unmarriedFemale")
      return "Ms." + value;
    else
      return "Mrs." + value;
  }

}
