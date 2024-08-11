import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajespersonalizadosService } from 'src/app/service/mensajespersonalizados.service';
import { MensajesPersonalizados } from 'src/app/model/MensajesPersonalizados';
import { ActivatedRoute, Router } from '@angular/router';

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
  activeTab: string = 'mensajes';

  variablesDisponibles: { [key: string]: string } = {
    '{name}': 'Nombre',
    '{services}': 'Servicio',
    '{perfil}': 'Correo del perfil',
    '{contrasena}': 'contaseña',
    '{fechainicio}': 'Fecha de Inicio',
    '{fechafin}': 'Fecha proxima de facturacion',
    '{estado}': 'Estado del cliente',
    '{socio}': 'Socio que lo capto',
    '{numerocelular}': 'Número de Celular'
  };

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajespersonalizadosService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.mensajeForm = this.fb.group({
      titulo: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listarMensajes();
    this.setupInputListener();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleAccordion(index: number) {
    const accordionItem = document.querySelectorAll('.accordion-item')[index];
    accordionItem.classList.toggle('open');
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
            this.showSuccessMessage("Mensaje creado correctamente.");
            this.setActiveTab('mensajes');
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
  
    const messageContentElement = document.getElementById('messageContent');
    if (messageContentElement) {
      messageContentElement.innerHTML = this.formatMessage(mensaje.message, false, true);
    }
    
    this.actualizarContador();
    this.setActiveTab('formulario');
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
    this.setActiveTab('mensajes');
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
          const variableKey = elementNode.getAttribute('data-variable');
          console.log('Variable encontrada:', variableKey); // Log para depuración
          if (variableKey) {
            text += variableKey;
          }
        } else {
          text += this.getTextContent(elementNode);
        }
      }
    });
    return text;
  }

  formatMessage(message: string, useQuotes: boolean = true, isEditable: boolean = false): string {
    const variablesDisponibles = this.variablesDisponibles;

    Object.keys(variablesDisponibles).forEach(variable => {
        const formattedVariable = useQuotes 
            ? `"${variablesDisponibles[variable]}"`
            : variablesDisponibles[variable];

        let styledVariable = `<span class="variable-chip" 
                                 data-variable="${variable}"  // Asegúrate de que el data-variable contenga la clave correcta
                                 style="display: inline-flex; align-items: center; background-color: #007bff; color: white; 
                                        padding: 5px 12px; border-radius: 20px; margin-right: 5px; 
                                        font-size: 14px; box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3); transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                                        cursor: pointer; white-space: nowrap;"
                                 contenteditable="false"
                                 onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 8px rgba(0, 123, 255, 0.4)';"
                                 onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px rgba(0, 123, 255, 0.3)';">
                                 ${formattedVariable}`;

        if (isEditable) {
            styledVariable += `<button 
                                    style="background: none; border: none; color: white; font-weight: bold; font-size: 12px; 
                                           margin-left: 8px; cursor: pointer; padding: 0; display: inline-flex; align-items: center;"
                                    onmouseover="this.style.color='#ffdddd';"
                                    onmouseout="this.style.color='white';"
                                    onclick="this.parentElement.remove();">
                                    &times;
                               </button>`;
        }

        styledVariable += `</span>`;
        
        message = message.replace(new RegExp(variable, 'g'), styledVariable);
    });

    return message;
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

      if (textLength >= this.maxCharacters) {
        const allowedText = this.getTextContent(messageContent).substring(0, this.maxCharacters);
        messageContent.innerHTML = allowedText;
        textLength = this.maxCharacters;
        messageContent.blur(); // Desenfoca el textarea para evitar seguir escribiendo
      }

      charCountElement.textContent = `${textLength}/${this.maxCharacters} caracteres`;

      if (textLength >= this.maxCharacters) {
        charCountElement.classList.add('exceeded');
      } else {
        charCountElement.classList.remove('exceeded');
      }
    }
  }

  setupInputListener() {
    const messageContent = document.getElementById('messageContent');
    if (messageContent) {
      messageContent.addEventListener('input', () => {
        this.actualizarContador();
      });
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

  goBack(): void {
    this.router.navigate(['/components/customer-overview']);
  }

  showSuccessMessage(message: string): void {
    alert(message);
  }
}
