import { Component } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: false,
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {
  showGalleryPopup: boolean = false;
  productImages: string[] = [
    'https://res.cloudinary.com/dew5wuua0/image/upload/v1751036799/pexels-photo-1152077_wa0u3p.jpg',
    'https://res.cloudinary.com/dew5wuua0/image/upload/c_crop,ar_4:3/v1751036952/ChatGPT_Image_27_de_jun._de_2025_12_08_09_ubup1d.png',
    'https://res.cloudinary.com/dew5wuua0/image/upload/c_fill,w_260,h_170/v1751037036/ChatGPT_Image_27_de_jun._de_2025_12_10_28_u4gvwf.png',
  ];

  openProductGallery() {
    this.showGalleryPopup = true;
  }

  closeProductGallery() {
    this.showGalleryPopup = false;
  }
}
