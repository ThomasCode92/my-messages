import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private _posts: Post[] = [];
  private _postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  public get posts() {
    return this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((responseData) => {
        console.log(responseData.message);

        this._posts = responseData.posts;
        this._postsUpdated.next([...this._posts]);
      });
  }

  public get postsUpdated() {
    return this._postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        console.log(responseData.message);

        this._posts.push(responseData.post);
        this._postsUpdated.next([...this._posts]);
      });
  }
}
