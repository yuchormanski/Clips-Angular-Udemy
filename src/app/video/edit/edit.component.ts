import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { IClip } from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() clip: IClip | null = null;
  showAlert = false;
  alertColor = 'green';
  alertMsg = 'Please, wait. Your clip is being uploaded';
  inSubmission = false;
  @Output() update = new EventEmitter();

  clipId = new FormControl('', {
    nonNullable: true,
  });

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipId,
  });

  constructor(
    private modal: ModalService,
    private clipService: ClipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modal.registerModal('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregisterModal('editClip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.clip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;

    this.clipId.setValue(this.clip.docId as string);
    this.title.setValue(this.clip.title);
  }

  async submit() {
    if (!this.clip) {
      return;
    }
    this.showAlert = true;
    this.alertColor = 'green';
    this.alertMsg = 'Please, wait. Your clip is updating';
    this.inSubmission = true;
    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong! Try again later';
      this.inSubmission = false;
      return;
    }

    this.clip.title = this.title.value;
    this.update.emit(this.clip);
    this.showAlert = true;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
    this.inSubmission = false;

    setTimeout(() => {
      this.modal.unregisterModal('editClip');
    }, 1000);
  }
}
