def print_trip_summary():
    # Ask the user for trip details
    destination      = input("Destination : ")
    country          = input("Country : ")
    days             = int(input("Days : "))
    budget           = float(input(f"Budget : "))
    currency         = input("Currency : ")
    travel_style     = input("Travel Style : ")
    travel_month     = input("Travel Month : ")
    hotel_cost       = float(input("Hotal Cost : "))
    transport_cost   = float(input("Transportation Cost : "))
    food_cost        = float(input("Food Cost : "))
    misc_cost        = float(input("Miscellaneous Cost : "))

    total = sum([hotel_cost, transport_cost, food_cost, misc_cost])

    print("========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination               : {destination}")
    print(f"Country                   : {country}")
    print(f"Days                      : {days}")
    print(f"Budget                    : {budget} {currency}")
    print(f"Currency                  : {currency}")
    print(f"Travel Style              : {travel_style}")
    print(f"Travel Month              : {travel_month}")
    print(f"Hotel Cost                : {hotel_cost}")
    print(f"Transportation Cost       : {transport_cost}")
    print(f"Food Cost                 : {food_cost}")
    print(f"Miscellaneous Cost        : {misc_cost}")
    print(f"Total Estimated Cost      : {total}")

    if total > budget:
        print("⚠ Budget exceeded.")

# Call it with any trip
print_trip_summary()
