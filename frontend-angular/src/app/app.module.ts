import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
    HomeOutline,
    SolutionOutline,
    UserOutline,
    TeamOutline,
    AppstoreOutline,
    BookOutline,
    FileTextOutline,
    CheckCircleOutline,
    EditOutline,
    DeleteOutline,
    ArrowLeftOutline,
    PlusOutline,
    SearchOutline,
    PlayCircleOutline
} from '@ant-design/icons-angular/icons';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { UserListComponent } from './components/user-list/user-list.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { LectureListComponent } from './components/lecture-list/lecture-list.component';
import { TestListComponent } from './components/test-list/test-list.component';
import { TestAttemptListComponent } from './components/test-attempt-list/test-attempt-list.component';

import { CoursesPageComponent } from './pages/courses-page/courses-page.component';
import { CourseDetailPageComponent } from './pages/course-detail-page/course-detail-page.component';
import { LectureDetailPageComponent } from './pages/lecture-detail-page/lecture-detail-page.component';
import { TestDetailPageComponent } from './pages/test-detail-page/test-detail-page.component';
import { TestPassPageComponent } from './pages/test-pass-page/test-pass-page.component';
import { CategoryDetailPageComponent } from './pages/category-detail-page/category-detail-page.component';
import { RoleDetailPageComponent } from './pages/role-detail-page/role-detail-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const icons = [
    HomeOutline,
    SolutionOutline,
    UserOutline,
    TeamOutline,
    AppstoreOutline,
    BookOutline,
    FileTextOutline,
    CheckCircleOutline,
    EditOutline,
    DeleteOutline,
    ArrowLeftOutline,
    PlusOutline,
    SearchOutline,
    PlayCircleOutline
];

@NgModule({
    declarations: [
        AppComponent,
        UserListComponent,
        RoleListComponent,
        CategoryListComponent,
        CourseListComponent,
        LectureListComponent,
        TestListComponent,
        TestAttemptListComponent,
        CoursesPageComponent,
        CourseDetailPageComponent,
        LectureDetailPageComponent,
        TestDetailPageComponent,
        TestPassPageComponent,
        CategoryDetailPageComponent,
        RoleDetailPageComponent,
        LoginPageComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        NzButtonModule,
        NzCardModule,
        NzFormModule,
        NzInputModule,
        NzMessageModule,
        NzSpinModule,
        NzLayoutModule,
        NzMenuModule,
        NzTableModule,
        NzModalModule,
        NzSelectModule,
        NzTagModule,
        NzCheckboxModule,
        NzRadioModule,
        NzProgressModule,
        NzAlertModule,
        NzDividerModule,
        NzListModule,
        NzGridModule,
        NzSpaceModule,
        NzIconModule,
        NzToolTipModule,
        NzInputNumberModule,
        NzCollapseModule
    ],
    providers: [
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: NZ_ICONS, useValue: icons }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }