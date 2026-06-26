import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CoursesPageComponent } from './pages/courses-page/courses-page.component';
import { CourseDetailPageComponent } from './pages/course-detail-page/course-detail-page.component';
import { LectureDetailPageComponent } from './pages/lecture-detail-page/lecture-detail-page.component';
import { TestDetailPageComponent } from './pages/test-detail-page/test-detail-page.component';
import { TestPassPageComponent } from './pages/test-pass-page/test-pass-page.component';
import { CategoryDetailPageComponent } from './pages/category-detail-page/category-detail-page.component';
import { RoleDetailPageComponent } from './pages/role-detail-page/role-detail-page.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { LectureListComponent } from './components/lecture-list/lecture-list.component';
import { TestListComponent } from './components/test-list/test-list.component';
import { TestAttemptListComponent } from './components/test-attempt-list/test-attempt-list.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
    { path: '', component: CoursesPageComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'roles', component: RoleListComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard] },
    { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },
    { path: 'lectures', component: LectureListComponent, canActivate: [AuthGuard] },
    { path: 'tests', component: TestListComponent, canActivate: [AuthGuard] },
    { path: 'attempts', component: TestAttemptListComponent, canActivate: [AuthGuard] },
    { path: 'courses/:id', component: CourseDetailPageComponent, canActivate: [AuthGuard] },
    { path: 'lectures/:id', component: LectureDetailPageComponent, canActivate: [AuthGuard] },
    { path: 'tests/:id', component: TestDetailPageComponent, canActivate: [AuthGuard] },
    { path: 'tests/:id/pass', component: TestPassPageComponent, canActivate: [AuthGuard] },
    { path: 'categories/:id', component: CategoryDetailPageComponent, canActivate: [AuthGuard] },
    { path: 'roles/:id', component: RoleDetailPageComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }