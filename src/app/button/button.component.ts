import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-button',
  // Se for um componente Standalone, inclua `standalone: true`:
  // standalone: true,
  imports: [MatButton],
  templateUrl: './button.component.html',
  // Por convenção, use styleUrls (no plural) caso tenha um array
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  /**
   * Texto que aparecerá no botão.
   * Exemplo de uso: <app-button label="Colaborador" [url]="'/colaborador'"></app-button>
   */
  @Input() label: string = 'Clique Aqui';

  /**
   * Rota para onde o botão deve navegar ao clicar.
   * Exemplo de uso: <app-button [label]="'Login'" [url]="'/login'"></app-button>
   */
  @Input() url: string = '/';

  /**
   * Se for verdadeiro, ao clicar no botão será feito logout (token removido).
   * Caso contrário, a navegação segue para a rota especificada em `url`.
   */
  @Input() isLogoutButton: boolean = false;

  constructor(private router: Router) {
  }

  goTo() {
    if (this.isLogoutButton) {
      // Limpa o token e redireciona para a tela de login (ou outra rota desejada)
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate([this.url]);
    }
  }
}
