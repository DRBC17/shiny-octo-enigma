import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css'],
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleadoForm: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo: string = 'Agregar';

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private activateRoute: ActivatedRoute
  ) {
    this.createEmpleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required],
    });

    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.esEditar();
  }

  ngOnInit(): void { }

  agregarEditarEmpleado(form: Empleado) {
    this.submitted = true;

    if (this.createEmpleadoForm.invalid) {
      return;
    }

    if (this.id === null) {
      this.agregarEmpleado(form);
    } else {
      this.editarEmpleado(form);
    }
  }
  agregarEmpleado(form: Empleado) {

    const { nombre, apellido, documento, salario } = form;
    const empleado: Empleado = {
      nombre,
      apellido,
      documento,
      salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    this._empleadoService
      .agregarEmpleado(empleado)
      .then(() => {
        this.loading = false;
        this.toastr.success("Empleado registrado con exito", "Empleado registrado")
        this.router.navigate(['/list-empleados']);
      })
      .catch((err) => {
        console.error(err);
        this.loading = false;
      });
  }
  editarEmpleado(form: Empleado) {
    const { nombre, apellido, documento, salario } = form;
    const empleado: Empleado = {
      nombre,
      apellido,
      documento,
      salario,
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    this._empleadoService.actualizarEmpleado(this.id, empleado).then(() => {
      this.loading = false;
      this.toastr.success("Empleado editado con exito", "Empleado editado")
      this.router.navigate(['/list-empleados']);
    })
      .catch((err) => {
        console.error(err);
        this.loading = false;
      });
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar';
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe((res) => {
        this.createEmpleadoForm.patchValue({
          nombre: res.payload.data()['nombre'],
          apellido: res.payload.data()['apellido'],
          documento: res.payload.data()['documento'],
          salario: res.payload.data()['salario'],
        });
        this.loading = false;
      }, (err) => {
        this.loading = false;
        console.error(err);

      })
    }
  }
}
