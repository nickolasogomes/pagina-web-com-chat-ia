import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gallery-popup',
  standalone: false,
  templateUrl: './gallery-popup.component.html',
  styleUrl: './gallery-popup.component.css'
})
export class GalleryPopupComponent {
  @Input() images: string[] = [];

  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closePopup();
    }
  }
}