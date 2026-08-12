def get_user_input():
    destination_list = []

    while True:
        destination = input("Destinations (type 'done' to finish): ")
        if destination.lower() == "done" or destination == "Done":
            break
        destination_list.append(destination)

    country = input("Country : ")
    days = int(input("Days : "))
    budget = float(input(f"Budget : "))
    currency = input("Currency : ")
    travel_style = input("Travel Style : ")
    travel_month = input("Travel Month : ")
    hotel_cost = float(input("Hotal Cost : "))
    transport_cost = float(input("Transportation Cost : "))
    food_cost = float(input("Food Cost : "))
    misc_cost = float(input("Miscellaneous Cost : "))

    return destination_list, country, days, budget, currency, travel_style, travel_month, hotel_cost, transport_cost, food_cost, misc_cost

def calculate_daily_budget(budget, days):
    return budget/days

def get_trip_category(budget):
    if budget > 1000 and budget <= 3000:
        return "Standard"
    elif budget > 3000:
        return "Luxury"

    return "Backpacker"

def transport_recommendation(category):
    if category.lower() == "backpacker":
        return "Bus" 
    elif category.lower() == "standard":
        return "Train"
    else:
        return "Flight"

def get_travel_season(month):
    if month.lower() == "december":
        return "Peak Season"
    elif month.lower() == "june":
        return "Holiday Season"
    else:
        return "Regular Season"

def get_recommended_places(destination_list):
    recommended_places = {
        "Japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "Korea": ["City Center", "Local Market", "Popular Landmark"]
    }

    for dest in destination_list:
        places = recommended_places.get(dest, ["Lorem Attraction 1", "Ipsum Attraction 2", "Dolor Attraction 3"])
        print(f"--- {dest} ---")
        for place in places:
            print(f"- {place}")
        print()