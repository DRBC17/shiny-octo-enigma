import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  constructor(firestore: AngularFirestore, private _empleadoService: EmpleadoService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getEmpleados();
  }


  getEmpleados() {
    this._empleadoService.getEmpleados().subscribe((res) => {
      this.empleados = [];
      res.forEach((element: any) => {
        // console.log(element.payload.doc.id);
        // console.log(element.payload.doc.data());

        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
        console.log(this.empleados);



      });

    }, (err) => {
      console.log(err);

    })
  }

  eliminarEmpleado(id: string) {
    this._empleadoService.eliminarEmpleado(id).then(() => {
      this.toastr.success("Empleado eliminado con exito", "Empleado eliminado")
    }).catch((err) => {
      console.error(err);

    })
  }

}
