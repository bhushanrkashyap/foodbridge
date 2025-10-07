import google.generativeai as genai

genai.configure(api_key="AIzaSyBK-2vS01ai7aAyJb2EjzWs2SJfYSvE7-c")
for m in genai.list_models():
    print(m.name, m.supported_generation_methods)
