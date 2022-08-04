import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Observable<{ [key: string]: any }> | Promise<{ [key: string]: any }> => {
  const file = <File>control.value;
  const fileReader = new FileReader();

  const fileReaderObs = new Observable(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
};
