import { Injectable } from '@angular/core';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private _posts: Post[] = [];

  public get posts() {
    return [...this._posts];
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this._posts.push(post);
  }
}
