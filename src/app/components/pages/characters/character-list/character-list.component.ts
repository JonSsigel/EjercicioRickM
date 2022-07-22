import { Component, OnInit, Inject, HostListener} from '@angular/core';
import { Character } from '@app/shared/Interfaces/character.interface';
import { CharacterService } from '@app/shared/services/character.service';
import { ActivatedRoute } from '@angular/router';

import { DOCUMENT } from '@angular/common';

import { take } from "rxjs/operators";

type RequestInfo={
  next: any;
};

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters:Character[]=[];

  info: RequestInfo={
    next: null,
  };

  private pageNum = 1;
  private query = " ";
  private hideScrollHeight = 200;
  private showScrollHeight = 500;

  constructor(
    @Inject(DOCUMENT) private document:Document,
    private characterSvc: CharacterService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDataFromService();
  }

  scrollDown():void{
    if(this.info.next){
      this.pageNum++;
      this.getDataFromService();
    }
  }

  // Get Characters
  private getDataFromService():void{
    this.characterSvc.searchCharacters(this.query,this.pageNum)
    .pipe(take(1)
    ).subscribe((res:any)=>{

      if(res?.results?.length){
        const{info,results}=res;
        this.characters=[...this.characters,...results];
        this.info = info;

      }else{
        this.characters =[];
      }
    })
  }

}
