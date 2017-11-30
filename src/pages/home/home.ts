import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  prais: number = 0;
  arrayTodos = [];
  myForm: FormGroup;
  objeto = {
    name: String,
    price: Number,
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public formBuilder: FormBuilder, private modal: ModalController, public storage: Storage) {
    this.getData()
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  openModal() {
    const myModal = this.modal.create('ModalPage');
    myModal.present();
  }

  getData() {
    this.storage.keys().then((arrayDeKeys) => {
      console.log(arrayDeKeys);
      this.arrayTodos = [];
      for (let i of arrayDeKeys) {
        this.storage.get(i).then((pepe) => {
          let obj = JSON.parse(pepe);
          this.arrayTodos.push(obj);
          console.log(obj);
        });
      }
    });
  }

  async saveData() {
    this.objeto.name = this.myForm.get('name').value;
    this.objeto.price = this.myForm.get('price').value;

    //Crea una key para el objeto que se esta guardando
        const num = await this.storage.length()
        console.log(num)
        let messi = num + 1;
        let key = "" + messi;
        console.log(key);
        //Guardo el objeto en storage
        let stringfyObj = JSON.stringify(this.objeto, null);
        this.storage.set(key, stringfyObj);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
        //this.getData();

  }

  deleteList() {
    this.storage.clear();
    this.getData();
  }

}
