import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePollDto, PollDto, VoteDto } from '../models/poll.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = `${environment.apiUrl}/api/polls`;

  constructor(private http: HttpClient) {}

  getAllPolls(): Observable<PollDto[]> {
    return this.http.get<PollDto[]>(this.apiUrl);
  }

  getPollById(id: number): Observable<PollDto> {
    return this.http.get<PollDto>(`${this.apiUrl}/${id}`);
  }

  createPoll(data: CreatePollDto): Observable<PollDto> {
    return this.http.post<PollDto>(this.apiUrl, data);
  }

  revealResults(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reveal`, {});
  }

  submitVote(data: VoteDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/vote`, data);
  }

  deletePoll(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
