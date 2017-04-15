import { Directive, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[timeMask]',
  host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(keydown.backspace)':'onInputChange($event.target.value, true)'
  }
})

export class TimeMaskDirective {
  constructor(public model: NgControl) {}
  
  @Output() rawChange:EventEmitter<number> = new EventEmitter<number>();

  onInputChange(event, backspace) {
    let newVal = event;
    
    let millis = '0000';
    let time = '0000';
    let punto = false;
    let rawTime = 0;

    if(backspace) {
      newVal = newVal.substring(0, newVal.length - 1);
    } 
    
    if(newVal.length === 0) {
      newVal = '';
    } else if (newVal.indexOf('.') !== -1) {
      punto = true;
      time = newVal.substring(0, newVal.indexOf('.'));
      time = time.replace(/\D/g, '');
      millis = newVal.substring(newVal.indexOf('.') + 1).replace(/^0+/, '');
    } else {
      punto = false;
      time = newVal.replace(/\D/g, '');
    }
    time = time.replace(/^0+/, '');

    if (millis.length > 4) {
      millis = millis.substring(1);
    }
    
    let pad = '00';
    
    if (time.length <= 2) {
      newVal = '00\'' + (pad.substring(0, pad.length - time.length) + time) + '\"';
      rawTime = parseInt(pad.substring(0, pad.length - time.length) + time);
    } else if (time.length <= 3) {
      newVal = '0' + time.charAt(0) + '\'' + time.substring(1) + '\"';
      rawTime = parseInt(time.charAt(0)) * 60 + parseInt(time.substring(1));
    } else if (time.length <= 4) {
      newVal = time.substring(0, 2) + '\'' +
               time.substring(2) + '\"';
      rawTime = parseInt(time.substring(0, 2)) * 60 + parseInt(time.substring(2));
    } else {
      newVal = time.substring(0, time.length - 4) + 'h ' +
               time.substring(time.length - 4, time.length - 2) + '\' ' +
               time.substring(time.length - 2) + '\"';
      rawTime = parseInt(time.substring(0, time.length - 4)) * 3600 + 
                parseInt(time.substring(time.length - 4, time.length - 2)) * 60 + 
                parseInt(time.substring(time.length - 2));
    }
    rawTime = rawTime * 10000;
    
    if (punto) {
      pad = '0000';
      newVal += '.' + pad.substring(0, pad.length - millis.length) + millis;
      rawTime = rawTime + parseFloat(pad.substring(0, pad.length - millis.length) + millis);
    }

    // set the new value
    this.model.valueAccessor.writeValue(newVal);      
    this.rawChange.emit(rawTime);
  }
}