import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  people = [];
  debtor = [];
  done = [];
  benefited = [];
  end = [];

  constructor(private view: ViewController, public storage: Storage) {
    this.getData()
  }

  closeModal() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  async getData() {
    let total = 0;
    const arrayDeKeys = await this.storage.keys()
    console.log(arrayDeKeys);
    this.people = [];
    for (let i of arrayDeKeys) {
      const pepe = await this.storage.get(i);
      let obj = JSON.parse(pepe);
      this.people.push(obj);
    }
    for (let i of Object.keys(this.people)) {
      total += parseInt(this.people[i].price);
    }
    let quotient = total / this.people.length
    for (let i of Object.keys(this.people)) {
      let price = (Math.abs(parseInt(this.people[i].price)))
      if (price < quotient) {
        this.people[i].price = Math.abs(price - quotient)
        this.people[i].state = "Tiene que pagar";
        this.debtor.push(this.people[i]);

      }else if (price == quotient){
        this.people[i].price = price - quotient
        this.people[i].state = "Ya pagaron"
        this.done.push(this.people[i]);

      }
      else {
        this.people[i].price = price - quotient
        this.people[i].state = "Le deben plata"
        this.benefited.push(this.people[i]);
      }
    }
      for (let i of Object.keys(this.debtor)){
        for (let j of Object.keys(this.benefited)){
          console.log(this.debtor[i].name + this.debtor[i].price + "+" + this.benefited[j].price)
          if (parseInt(this.debtor[i].price) <= parseInt(this.benefited[j].price)){
            if (this.debtor[i].price != 0){
              this.end.push({text:`${this.debtor[i].name} paga a ${this.benefited[j].name} ${this.debtor[i].price}`})
              this.benefited[j].price =  this.benefited[j].price - this.debtor[i].price
              this.debtor[i].price = 0
            }
          }else{
            if (this.benefited[j].price != 0){
              this.end.push({text:`${this.debtor[i].name} paga A ${this.benefited[j].name} ${this.benefited[j].price}`})
              //this.benefited[j].price = this.debtor[i].price - this.benefited[j].price
              this.debtor[i].price = this.debtor[i].price - this.benefited[j].price
              this.benefited[j].price = 0
            }
          }
        }
      }
  }

}
