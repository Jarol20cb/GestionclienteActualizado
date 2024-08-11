import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajespersonalizadosService } from 'src/app/service/mensajespersonalizados.service';
import { MensajesPersonalizados } from 'src/app/model/MensajesPersonalizados';

@Component({
  selector: 'app-mensajes-personalizados',
  templateUrl: './mensajes-personalizados.component.html',
  styleUrls: ['./mensajes-personalizados.component.css']
})
export class MensajesPersonalizadosComponent implements OnInit {
  mensajeForm: FormGroup;
  maxCharacters = 250;
  mensajes: MensajesPersonalizados[] = [];
  editMode: boolean = false;
  mensajeEditado: MensajesPersonalizados | null = null;

  variablesDisponibles: { [key: string]: string } = {
    '{name}': 'Nombre',
    '{services}': 'Servicios',
    '{perfil}': 'Perfil',
    '{contrasena}': 'contaseña',
    '{fechainicio}': 'Fecha de Inicio',
    '{fechafin}': 'Fecha de Fin',
    '{estado}': 'Estado',
    '{socio}': 'Socio',
    '{numerocelular}': 'Número de Celular'
  };

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajespersonalizadosService
  ) {
    this.mensajeForm = this.fb.group({
      titulo: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listarMensajes();
  }

  listarMensajes() {
    this.mensajesService.list().subscribe(
      data => {
        this.mensajes = data;
      },
      error => {
        console.error('Error al listar los mensajes', error);
      }
    );
  }

  onSubmit() {
    const messageContent = this.getTextContent(document.getElementById('messageContent'));
    this.mensajeForm.patchValue({ message: messageContent });

    if (this.mensajeForm.valid) {
      const mensaje = this.mensajeForm.value;

      if (this.editMode && this.mensajeEditado) {
        // Modo edición
        mensaje.id = this.mensajeEditado.id;
        this.mensajesService.update(mensaje).subscribe(
          response => {
            console.log('Mensaje actualizado exitosamente');
            this.cancelEdit();
            this.listarMensajes();
          },
          error => {
            console.error('Error al actualizar el mensaje', error);
          }
        );
      } else {
        // Modo creación
        this.mensajesService.insert(mensaje).subscribe(
          response => {
            console.log('Mensaje guardado exitosamente');
            this.mensajeForm.reset();
            document.getElementById('messageContent')!.innerHTML = '';
            this.actualizarContador();
            this.listarMensajes();
          },
          error => {
            console.error('Error al guardar el mensaje', error);
          }
        );
      }
    }
  }

  editarMensaje(mensaje: MensajesPersonalizados) {
    this.editMode = true;
    this.mensajeEditado = mensaje;
    this.mensajeForm.patchValue({
      titulo: mensaje.titulo,
      message: mensaje.message
    });
    document.getElementById('messageContent')!.innerHTML = mensaje.message;
    this.actualizarContador();
  }

  eliminarMensaje(id: number) {
    this.mensajesService.delete(id).subscribe(
      response => {
        console.log('Mensaje eliminado exitosamente');
        this.listarMensajes();
      },
      error => {
        console.error('Error al eliminar el mensaje', error);
      }
    );
  }

  cancelEdit() {
    this.editMode = false;
    this.mensajeEditado = null;
    this.mensajeForm.reset();
    document.getElementById('messageContent')!.innerHTML = '';
    this.actualizarContador();
  }

  getTextContent(element: HTMLElement | null): string {
    if (!element) return '';
    let text = '';
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elementNode = node as HTMLElement;
        if (elementNode.classList.contains('variable-chip')) {
          text += elementNode.getAttribute('data-variable');
        } else {
          text += this.getTextContent(elementNode);
        }
      }
    });
    return text;
  }

  agregarVariable(variable: string) {
    const messageContent = document.getElementById('messageContent');
    if (messageContent) {
      const currentText = this.getTextContent(messageContent);
      if (currentText.length + variable.length <= this.maxCharacters) {
        const span = document.createElement('span');
        span.className = 'variable-chip';
        span.setAttribute('data-variable', variable);
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.backgroundColor = '#007bff';
        span.style.color = 'white';
        span.style.padding = '5px 12px';
        span.style.borderRadius = '20px';
        span.style.marginRight = '5px';
        span.style.marginBottom = '5px';
        span.style.fontSize = '14px';
        span.style.position = 'relative';
        span.style.cursor = 'pointer';
        span.style.boxShadow = '0 4px 6px rgba(0, 123, 255, 0.3)';
        span.style.transition = 'transform 0.2s, box-shadow 0.2s';

        const textNode = document.createTextNode(this.variablesDisponibles[variable]);
        span.appendChild(textNode);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.fontSize = '12px';
        closeButton.style.lineHeight = '1';
        closeButton.style.marginLeft = '8px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0';

        closeButton.onmouseover = () => {
          closeButton.style.color = '#ffdddd';
        };
        closeButton.onmouseout = () => {
          closeButton.style.color = 'white';
        };

        closeButton.onclick = () => {
          span.remove();
          this.actualizarContador();
        };
        span.appendChild(closeButton);

        span.onmouseover = () => {
          span.style.transform = 'scale(1.05)';
          span.style.boxShadow = '0 6px 8px rgba(0, 123, 255, 0.4)';
        };
        span.onmouseout = () => {
          span.style.transform = 'scale(1)';
          span.style.boxShadow = '0 4px 6px rgba(0, 123, 255, 0.3)';
        };

        span.contentEditable = 'false';
        messageContent.appendChild(span);
        messageContent.appendChild(document.createTextNode(' '));

        this.actualizarContador();
      }
    }
  }

  actualizarContador(): void {
    const messageContent = document.getElementById('messageContent');
    const charCountElement = document.getElementById('charCount');
    if (messageContent && charCountElement) {
      let textLength = this.getTextContent(messageContent).length;
      
      if (textLength > this.maxCharacters) {
        const range = window.getSelection()?.getRangeAt(0);
        const selectionStart = range?.startOffset ?? 0;
        const text = messageContent.innerText.substring(0, this.maxCharacters);
        messageContent.innerText = text;
        textLength = text.length;
        if (range) {
          range.setStart(messageContent.childNodes[0], Math.min(selectionStart, text.length));
          range.setEnd(messageContent.childNodes[0], Math.min(selectionStart, text.length));
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
        }
      }

      charCountElement.textContent = `${textLength}/${this.maxCharacters} caracteres`;
      if (textLength >= this.maxCharacters) {
        charCountElement.classList.add('exceeded');
      } else {
        charCountElement.classList.remove('exceeded');
      }
    }
  }

  getVariablesDisponibles(): { key: string, value: string }[] {
    return Object.entries(this.variablesDisponibles).map(([key, value]) => ({ key, value }));
  }

  limpiarMensaje(): void {
    const messageContentElement = document.getElementById('messageContent');
    if (messageContentElement) {
      messageContentElement.innerHTML = '';
      this.actualizarContador();
    }
  }
}
