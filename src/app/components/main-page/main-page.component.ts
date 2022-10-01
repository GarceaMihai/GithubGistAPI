import {Component, OnDestroy, OnInit} from '@angular/core';
import {GistService} from "../../services/gist.service";
import {Subscription} from "rxjs";
import {faCss3, faGolang, faHtml5, faJava, faJs, faPython, IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {faFile} from "@fortawesome/free-regular-svg-icons";
import {UserService} from "../../services/user.service";
import {FileService} from "../../services/file.service";
import {MatDialog} from "@angular/material/dialog";
import {FileDialogComponent} from "../file-dialog/file-dialog.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  getListOfPublicGistsByUsernameSubscription: Subscription;
  getListOfForksSubscription: Subscription;
  getLastForkedByAvatarSubscription: Subscription;
  getFileContentSubscription: Subscription;

  gists = [];

  constructor(private gistService: GistService,
              private userService: UserService,
              private fileService: FileService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  getListOfPublicGistsByUsername(username: string): void {
    this.gists = [];
    this.getListOfPublicGistsByUsernameSubscription = this.gistService.getListOfPublicGistsByUsername(username)
      .subscribe({
        next: (data) => {
          for (let i = 0; i < data.length; i++) {
            let gist = [];

            let files = [];
            for (let key in data[i]['files']) {
              files.push(data[i]['files'][key]);
            }
            gist.push(files);

            let lastForkedBy;
            this.getListOfForksSubscription = this.gistService.getListOfForks(data[i]['forks_url']).subscribe({
              next: (data) => {
                if (data.length > 0) {
                  lastForkedBy = data[0]['owner']['login'];
                  gist.push('Last forked by ' + lastForkedBy);

                  this.getLastForkedByAvatarSubscription = this.userService.getAvatar(data[0]['owner']['avatar_url']).subscribe({
                    next: async (data) => {
                      gist.push(await this.createImageFromBlob(data));
                    },
                    error: (error) => {
                      throw error;
                    }
                  });
                } else {
                  gist.push('');
                  gist.push(null);
                }
              },
              error: (error) => {
                throw error;
              }
            });

            this.gists.push(gist);
          }
        },
        error: (error) => {
          throw error;
        }
      });
  }

  getFileBadge(language: string): IconDefinition {
    if (language === 'JavaScript') {
      return faJs;
    } else if (language === 'Python') {
      return faPython;
    } else if (language === 'Java') {
      return faJava;
    } else if (language === 'HTML') {
      return faHtml5;
    } else if (language === 'CSS') {
      return faCss3;
    } else if (language === 'Go') {
      return faGolang;
    } else {
      return faFile;
    }
  }

  openDialog(rawUrl: string): void {
    this.fileService.getFileContent(rawUrl).subscribe({
      next: (data) => {
        const dialogRef = this.dialog.open(FileDialogComponent, {
          width: '500px',
          data: data
        });
      },
      error: (error) => {
        throw error;
      }
    });
  }

  private createImageFromBlob(image: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  }

  ngOnDestroy(): void {
    if (this.getListOfPublicGistsByUsernameSubscription) {
      this.getListOfPublicGistsByUsernameSubscription.unsubscribe();
    }
    if (this.getListOfForksSubscription) {
      this.getListOfForksSubscription.unsubscribe();
    }
    if (this.getLastForkedByAvatarSubscription) {
      this.getLastForkedByAvatarSubscription.unsubscribe();
    }
    if (this.getFileContentSubscription) {
      this.getFileContentSubscription.unsubscribe();
    }
  }
}
