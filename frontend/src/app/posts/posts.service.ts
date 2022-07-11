import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry, Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private _posts: Post[] = [];
  private _postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  public get posts() {
    return this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(responseData => {
          return {
            message: responseData.message,
            posts: responseData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
              };
            }),
          };
        })
      )
      .subscribe(postsData => {
        console.log(postsData.message);

        this._posts = postsData.posts;
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
      .subscribe(responseData => {
        console.log(responseData.message);

        this._posts.push(responseData.post);
        this._postsUpdated.next([...this._posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }
}
