import tkinter as tk
import speech_recognition as sr
from tkinter import messagebox
from tkinter import filedialog

def Speech_to_text():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        try:
            audio = r.listen(source)
            text = r.recognize_google(audio)
            txtSpeech.insert(tk.END, text + "\n")
        
        except sr.UnknownValueError:
            txtSpeech.insert(tk.END, "Could not understand \n")

        except sr.RequestError as e:
            txtSpeech.insert(tk.END, "Error {0}\n".format(e))

def reset_txtSpeech():
    txtSpeech.delete("1.0", tk.END)

def exit_system():
    result = messagebox.askquestion("Exit System", "Confirm if you want to exit?")
    if result == 'yes':
        messagebox.showinfo("ThankYou", "Thanks for using")
        root.destroy()

def save_text():
    text_to_save = txtSpeech.get("1.0", tk.END)
    file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text files", "*.txt")])
    if file_path:
        with open(file_path, "w") as file:
            file.write(text_to_save)

root = tk.Tk()
root.title("Speech To Text")

MainFrame = tk.Frame(root, bd=20, width=900, height=300)
MainFrame.pack()

lblTitle = tk.Label(MainFrame, font=('arial', 80, 'bold'), text="Speech To Text", width=18)
lblTitle.pack()

txtSpeech = tk.Text(MainFrame, font=('arial', 30, 'bold'), width=68, height=12)
txtSpeech.pack()

btnconvert = tk.Button(MainFrame, font=('arial', 30, 'bold'), text="Convert To Text", width=18, height=2,
                      command=Speech_to_text)
btnconvert.pack(side=tk.LEFT, padx=5)

btnReset = tk.Button(MainFrame, font=('arial', 30, 'bold'), text="Reset", width=18, height=2, command=reset_txtSpeech)
btnReset.pack(side=tk.LEFT, padx=5)

btnSave = tk.Button(MainFrame, font=('arial', 30, 'bold'), text="Save", width=18, height=2, command=save_text)
btnSave.pack(side=tk.LEFT, padx=5)

btnExit = tk.Button(MainFrame, font=('arial', 30, 'bold'), text="Exit", width=18, height=2, command=exit_system)
btnExit.pack(side=tk.LEFT, padx=5)
root.mainloop()
