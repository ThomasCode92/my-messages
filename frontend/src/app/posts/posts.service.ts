import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';

import { Post } from './post.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private _posts: Post[] = [];
  private _postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  public get postsUpdated() {
    return this._postsUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(responseData => {
          return {
            message: responseData.message,
            posts: responseData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: responseData.maxPosts,
          };
        })
      )
      .subscribe(postsData => {
        console.log(postsData.message);
        console.log(postsData.posts);

        this._posts = postsData.posts;
        this._postsUpdated.next({
          posts: [...this._posts],
          postCount: postsData.maxPosts,
        });
      });
  }

  getPost(postId: string) {
    return this.http
      .get<{ message: string; post: any }>(BACKEND_URL + postId)
      .pipe<{ message: string; post: Post }>(
        map(responseData => {
          return {
            message: responseData.message,
            post: {
              id: responseData.post._id,
              title: responseData.post.title,
              content: responseData.post.content,
              imagePath: responseData.post.imagePath,
              creator: responseData.post.creator,
            },
          };
        })
      );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();

    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: any }>(BACKEND_URL, postData)
      .pipe<{ message: string; post: Post }>(
        map(responseData => {
          return {
            message: responseData.message,
            post: {
              id: responseData.post._id,
              title: responseData.post.title,
              content: responseData.post.content,
              imagePath: responseData.post.imagePath,
              creator: responseData.post.creator,
            },
          };
        })
      )
      .subscribe(postData => {
        console.log(postData.message);
        this.router.navigate(['/']);
      });
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string,
    creator: string
  ) {
    let postData: FormData | Post;

    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      postData.append('creator', creator);
    } else {
      postData = { id: postId, title, content, imagePath: image, creator };
    }

    this.http
      .put<{ message: string }>(BACKEND_URL + postId, postData)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + postId);
  }
}
