import traceback
try:
    import main
    print('import successful')
except Exception as e:
    traceback.print_exc()
