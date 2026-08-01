x = int(input("Enter a number: "))
for i in range(1, x):
    print(i)
    if x % 3 == 0 and x % 5 == 0:
        print("TECHHACKATHON")
    elif x % 3 == 0:
        print("TECH")
    elif x % 5 == 0:
        print("HACKATHON")
    else:
        print(i)