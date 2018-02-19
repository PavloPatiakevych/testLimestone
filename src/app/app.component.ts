import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;
export interface Technologies {
  tName: string;
  tPercent: number;
}
// інтерфейс для дати з масивом технологій
export interface Statistics {
  date: Date;
  techs: Technologies[];
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('exampleModal') dialog: ElementRef = null;
  title = 'app';
  data: Statistics[] = [];
  curData: Statistics = null;
  dates: SelectItem[] = [];
  outString = '';
  pie: any;
  ua: any;
  public form: FormGroup = null;
  private techNames: string[] = [];
  public suggest: string[] = []

  constructor(private _fb: FormBuilder) {
    //структура данних для відображення 
    this.data = [
      {
        date: new Date(2018, 1, 1), techs: [
          { tName: 'ASP NET CORE', tPercent: 50 },
          { tName: 'Angular', tPercent: 25 },
          { tName: 'MongoDb', tPercent: 10 },
          { tName: 'HTML', tPercent: 15 },
        ]
      },
      {
        date: new Date(2018, 1, 2), techs: [
          { tName: 'ADB .NET', tPercent: 90 },
          { tName: 'AngularJS', tPercent: 5 },
          { tName: 'SQL', tPercent: 1 },
          { tName: 'CSS', tPercent: 4 },
        ]
      },
      {
        date: new Date(2018, 3, 12), techs: [
          { tName: 'JAVA', tPercent: 12 },
          { tName: 'EF', tPercent: 25 },
          { tName: 'MongoDb', tPercent: 41 },
          { tName: 'SCSS', tPercent: 33 },
        ]
      },
      {
        date: new Date(2018, 3, 11), techs: [
          { tName: 'PHP', tPercent: 52 },
          { tName: 'Angular 5', tPercent: 15 },
          { tName: 'SQLite', tPercent: 11 },
          { tName: 'HTML 5', tPercent: 15 },
        ]
      },
      {
        date: new Date(2018, 3, 13), techs: [
          { tName: 'ASP NET', tPercent: 52 },
          { tName: 'AJAX', tPercent: 15 },
          { tName: 'Pascal', tPercent: 11 },
          { tName: 'Sass', tPercent: 15 },
        ]
      },
    ];
    this.dates = this.data.map(item => <SelectItem>{ label: item.date.toLocaleDateString(), value: item.date }); // створити масив дат для dropdown
    this.curData = this.data[0];
    this.techNames = [...this.curData.techs.map(item => item.tName)];
    this.outString = this._outString();
    this.setPieData();


    // структура для календаря
    this.ua = {
      firstDayOfWeek: 0,
      dayNames: ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П`ятниця', 'Субота', 'Неділя'],
      dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
      monthNames: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень',
        'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
      monthNamesShort: ['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'],
      today: 'Сьогодні'
    };

    this.createFormStruct();

  }
  // виведення технологій для вказаної дати
  public onBlur(event) {
    const newDate = new Date(this.form.value.date);
    const findItem = this.data.find(item => item.date.getTime() === newDate.getTime());
    this.techNames = findItem ? findItem.techs.map(item => item.tName) : [];
  }
  //пошук назв технологій для автозаповнення
  public search(event) {
    let filtered: any[] = [];
    for (let i = 0; i < this.techNames.length; i++) {
      let country = this.techNames[i];
      if (country.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.suggest = [...filtered];
  }
  // заповнення графіку іменами, процентами та кольорами
  private setPieData() {
    this.pie = {
      labels: [...this.curData.techs.map(item => item.tName)],
      datasets: [
        {
          data: [...this.curData.techs.map(item => item.tPercent)],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#7d4627",
            "#9068be",
            "#e62739",
            "#fae596",
            "#173e43",
            "#b56969",
            "#22264b",
          ]
        }]
    };
  }
  // порожні поля реактивної форми
  public createFormStruct() {
    this.form = this._fb.group({
      date: [null, Validators.required],
      tech: ['', Validators.required],
      percent: ['', Validators.required]
    })
  }


  // запис існуючими значеннями полей
  public patchValues() {
    this.form.patchValue({
      date: '',
      tech: '',
      percent: ''
    })
  }

  private _outString(): string {
    const outStr = this.curData ? this.curData.techs.map(item => `${item.tName}-${item.tPercent} %`).join(', ') : ''; // отримати набір "технологія-процент"   
    return outStr;                                                                                                    // і помістити в строку через ","

  }

  public onChangeDate(event) {                                    // при зміні значення в dropdown, вивести відповідне значення
    const newDate = event.value;
    this.curData = this.data.find(item => item.date === newDate);
    this.outString = this._outString();

    this.setPieData();
  }

  ngOnInit() {

  }

  private SaveChanges() {

    if (this.dialog != null) {
      $(this.dialog.nativeElement).modal('hide');
    }  //закрити діалог
    const findItem = this.data.find(item => item.date.getTime() === this.form.value.date.getTime()); // пошук дати в масиві данних

    if (findItem == null) { // дати немає
      const newItem = <Statistics>{ date: this.form.value.date, techs: [{ tName: this.form.value.tech, tPercent: this.form.value.percent }] };
      this.data.push(newItem);
      this.dates = this.data.map(item => <SelectItem>{ label: item.date.toLocaleDateString(), value: item.date });

      return; 
    }

    // дата знайдена 
    const findSubItem = findItem.techs.find(item => item.tName === this.form.value.tech); // пошук технології
    if (findSubItem == null) {  // технологія не знайдена
      findItem.techs.push({ tName: this.form.value.tech, tPercent: this.form.value.percent });
      this.setPieData();
      this.outString = this._outString();
      return;
    }
    
    findSubItem.tPercent = this.form.value.percent; // зміна проценту в знайденій технології
    this.setPieData();
    this.outString = this._outString();
  }


}
