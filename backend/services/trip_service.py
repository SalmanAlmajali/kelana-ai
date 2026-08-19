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

def trip_categories():
    return [
        "Backpacker",
        "Standard",
        "Luxury"
    ]

def trip_transportations():
    return [
        "Bus",
        "Train",
        "Flight"
    ]


def get_trip_category(budget):
    if budget > 1000 and budget <= 3000:
        return trip_categories()[1]
    elif budget > 3000:
        return trip_categories()[2]

    return trip_categories()[0]

def transport_recommendation(travel_style):
    if travel_style.lower() == "backpacker":
        return trip_transportations()[0] 
    elif travel_style.lower() == "family":
        return trip_transportations()[1] 
    else:
        return trip_transportations()[2]

def get_travel_season(month):
    if month.lower() == "december":
        return "Peak Season"
    elif month.lower() == "june":
        return "Holiday Season"
    else:
        return "Regular Season"

def get_recommended_places(destination = None):
    recommended_places = {
        "Japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "Korea": ["City Center", "Local Market", "Popular Landmark"]
    }
    

    if (destination is not None):
        places = recommended_places.get(destination, ["Lorem Attraction 1", "Ipsum Attraction 2", "Dolor Attraction 3"])
        return places
    
    return recommended_places