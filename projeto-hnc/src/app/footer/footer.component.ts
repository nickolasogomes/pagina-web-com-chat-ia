import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  user = {
    name: '',
    email: '',
    phone: ''
  };

  onSubmit(form: any) {
    if (form.valid) {
      console.log(this.user);
    }
  }
}