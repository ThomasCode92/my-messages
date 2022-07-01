import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';

  constructor(private postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) return;

    const title = form.value.title;
    const content = form.value.content;

    this.postsService.addPost(title, content);
  }
}
