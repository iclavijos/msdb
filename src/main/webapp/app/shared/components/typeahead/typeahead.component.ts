import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { UntypedFormGroup } from "@angular/forms";

import { Observable, BehaviorSubject } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

export type DisplayWithFunc<T> = (item: T) => string;
export type TooltipFunc<T> = (item: T) => string;

@Component({
  selector: 'jhi-autocomplete',
  templateUrl: './typeahead.component.html'
})
export class TypeAheadComponent<T> implements OnInit {

  @Input() editForm!: UntypedFormGroup;
  @Input() elementId!: string;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() items!: Observable<T[] | null>;
  @Input() isRequired = false;
  @Input() imageAttr = '';
  @Input() imageUrlPattern!: string;
  @Input() icon = '';

  @Input() displayWithFunction!: DisplayWithFunc<T>;
  @Input() tooltipFunction!: TooltipFunc<T>;

  private typeAheadBlurred = new BehaviorSubject(false);
  private typeAheadValueSelected = new BehaviorSubject(false);
  private isTimerStarted = false;
  private isValueSelected = false;
  private isValueChanged = false;
  private isAlive = true;
  private CHECK_SELECTION_TIMEOUT = 50;
  private timer!: any;

  constructor(
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.typeAheadBlurred.pipe(
      takeWhile(() => this.isAlive), // auto-unsubscribe
      tap((next) => {
        this.isTimerStarted = next;
        if (this.isTimerStarted) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
              if (!this.isValueSelected && this.isValueChanged) {
                this.elementRef.nativeElement.querySelector('#' + this.elementId).value = null;
                this.editForm.patchValue({
                  [this.controlName]: null,
                });
                this.isValueChanged = false;
              }
            this.isValueSelected = false;
            this.typeAheadBlurred.next(false);
          }, this.CHECK_SELECTION_TIMEOUT);
        }
      })
      ).subscribe();

    this.typeAheadValueSelected.pipe(
      takeWhile(() => this.isAlive)
    ).subscribe((valueSelected) => this.isValueSelected = valueSelected);
  }

  onValueChanged(): void {
    this.isValueChanged = true;
  }

  onBlurLayout(): void {
    this.typeAheadBlurred.next(true);
  }

  onOptionSelected(): void {
    this.isValueSelected = true;
    this.typeAheadValueSelected.next(true);
  }

  isImageValueAvailable(item: T): boolean {
    return (item as any)[this.imageAttr] !== undefined && (item as any)[this.imageAttr] !== '';
  }

  getImageSrc(item: T): string {
    const imageName = (item as any)[this.imageAttr] as string;
    if (this.imageUrlPattern) {
      return this.imageUrlPattern.replace('%s', imageName);
    } else {
      return imageName;
    }
  }

}
