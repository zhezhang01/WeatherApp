import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {list} from '../favorite/favList'

@Injectable()
export class MissionService {

  // Observable string sources
  private missionAnnouncedSource = new Subject<list[]>();
  // private missionConfirmedSource = new Subject<string>();

  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  // missionConfirmed$ = this.missionConfirmedSource.asObservable();

  // Service message commands
  announceMission(mission: list[]) {
    this.missionAnnouncedSource.next(mission);
  }

  // confirmMission(astronaut: string) {
  //   this.missionConfirmedSource.next(astronaut);
  // }
}