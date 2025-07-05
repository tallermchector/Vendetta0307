import subprocess
import os
import datetime

# --- Configuración ---
LINT_COMMAND = ["bun", "run", "lint"]
ERROR_LOG_FILE = "lint_errors.txt"

def ejecutar_lint_y_capturar_errores():
    """
    Ejecuta el comando de lint del proyecto, captura la salida y,
    si encuentra errores, los guarda en un archivo de texto.
    """
    print("🚀 Iniciando el proceso de linting del proyecto...")
    print(f"Comando a ejecutar: {' '.join(LINT_COMMAND)}\n")

    try:
        # Ejecuta el comando de lint y captura la salida (stdout y stderr)
        # Se usa shell=True para compatibilidad.
        proceso = subprocess.run(
            LINT_COMMAND,
            capture_output=True,
            text=True,
            check=False, # No lanza una excepción si el comando falla
            shell=True
        )

        # Verifica si el linting falló (código de salida no es 0)
        if proceso.returncode != 0:
            print(f"❌ Linting fallido con código de salida: {proceso.returncode}")

            # Combina la salida estándar y la salida de error
            errores = f"--- Errores de Linting - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---\n\n"
            errores += "--- Salida Estándar (stdout) ---\n"
            errores += proceso.stdout
            errores += "\n--- Salida de Error (stderr) ---\n"
            errores += proceso.stderr

            # Guarda los errores en el archivo de texto
            with open(ERROR_LOG_FILE, "w", encoding="utf-8") as f:
                f.write(errores)

            print(f"📄 Errores guardados en el archivo: {os.path.abspath(ERROR_LOG_FILE)}")
        else:
            print("✅ ¡Linting completado con éxito! No se encontraron errores.")
            # Si el linting es exitoso, elimina el archivo de errores si existe
            if os.path.exists(ERROR_LOG_FILE):
                os.remove(ERROR_LOG_FILE)
                print(f"🗑️ Archivo de errores anterior '{ERROR_LOG_FILE}' eliminado.")

    except FileNotFoundError:
        print("Error: El comando 'bun' no se encontró.")
        print("Asegúrate de que Bun esté instalado y en el PATH de tu sistema.")
    except Exception as e:
        print(f"Ha ocurrido un error inesperado: {e}")

if __name__ == "__main__":
    ejecutar_lint_y_capturar_errores()
