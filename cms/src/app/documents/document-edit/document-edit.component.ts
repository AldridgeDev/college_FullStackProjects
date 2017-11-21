import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../documents.service';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  document: Document;
  originalDocument: Document;
  editMode: boolean = false;
  id: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private documentService: DocumentService
            ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];

          if (this.id === undefined || this.id === null) {
            this.editMode = false;
            return;
          }

          this.originalDocument = this.documentService.getDocument(this.id);
          if (this.originalDocument === undefined || this.originalDocument === null) {
            return;
          }

          this.editMode = true;
          this.document = JSON.parse(JSON.stringify(this.originalDocument));
        }
      );
  }

  onSubmit(form: NgForm) {
    const values = form.value;

    const newDocument = new Document('',
                                    values.name,
                                    values.description,
                                    values.documentURL,
                                    null);

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument,
                                               newDocument);
    }
    else {
      this.documentService.addDocument(newDocument);
    }

    this.editMode = false;
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['/documents']);
  }
}
