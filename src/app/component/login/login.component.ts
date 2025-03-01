import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtRequest } from 'src/app/model/jwtRequest';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router, private snackBar: MatSnackBar) { }
  username: string = ""
  password: string = ""
  mensaje: string = ""

  ngOnInit(): void { }

  login() {
    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe((data: any) => {
      console.log('Token recibido:', data.jwttoken);
      console.log('Username recibido:', data.username);
      console.log('Rol recibido:', data.rol);
      sessionStorage.setItem("token", data.jwttoken);
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("rol", data.rol);
      this.loginService.getUserDetails().subscribe(() => {
        this.router.navigate(['components/home']);
      });
    }, error => {
      this.mensaje = "Credenciales incorrectas!!!"
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    });
  }
}
