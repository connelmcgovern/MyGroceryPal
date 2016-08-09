Parse.initialize("hRNDGFprtpZn3OoKXdZHivCt6ZRiNSRd4WrGI1V2", "b9F2hxfq1XG6FJUOX6ojiRxRBDw6AGTnmwvu4KDR");
var ShoppingList = Parse.Object.extend("ShoppingList");

$(document).ready(function() 
{
    //Retrieving all items from Parse upon initialisation of Shopping List page
    var user = Parse.User.current().get("username");//curent user logged in
    var query = new Parse.Query(ShoppingList);
    var totalPrice = 0;

    function refreshTotal()
    {
        totalPrice = totalPrice.toFixed(2);
        $("#totalPrice").empty();
        $("#totalPrice").append("<b>Total Price:</b> &#8364;" + totalPrice);
    }

    query.equalTo("User",user);
    query.find
    ({
        success: function(results)
        {
            for(var i in results)
            {
                var parseItem = results[i].get("Item");//items into array
                var parsePrice = results[i].get("Price");//Prices into array into array
                var TescoItem = results[i].get("TescoItem");//Tesco Prices into array

                totalPrice = parseFloat(totalPrice) + parseFloat(parsePrice);

                $("#input-List").append("<li><div id='listDiv' class='w3-container w3-card-4 w3-light-grey w3-round-xxlarge'><p><b>"+parseItem+"<br>Item: </b>"+TescoItem+"<br><b> Price: &#8364;</b>"+parsePrice+"</p><button id='RemoveItem'style='float:right' class='w3-btn w3-red w3-round-xxlarge'>Remove Item</button></div></li>");//print array into the list div
            }
            refreshTotal();
        }, 
        error: function(error)
        {
            console.log("Parse error:" + error);
        }
    });

    $(document).on('click','#RemoveItem', function() //Remove item by clicking on the remove button  on the shopping list
    {
        $(this).parent().remove();
        var data = $(this).parent().html();
        var itemString = JSON.stringify(data);

        var newitemString = itemString.replace("</b>", "");
        var item = newitemString.match(/Item: (.*?)<br><b>/i)[1];

        var user = Parse.User.current().get("username");

        var query = new Parse.Query(ShoppingList);
        query.equalTo("User", user);
        query.equalTo("TescoItem", item);
        query.find
        ({
            success: function(results)
            {
                for (var i = 0; i < results.length; i+=1) 
                {
                    current = results[i];
                    current.destroy({});// Remove entire Object from Parse
                    alert("Item removed from shopping list!")
                    location.href ='ShoppingList.html';//Re-load Shopping List page
                }
            }, 
            error: function(error)
            {
                alert("Item does not exist in the shopping list");
                console.log("Parse error:" + error);
            }
        });
    });

    $("#addItem").click(function(event)
    {
        event.preventDefault();
        var price = 0;
        var TescoItem = "";
        var inputItem = $("#input-item").val();//user input
        var user = Parse.User.current().get("username");//current logged in user

        //Get price
        var i = 0;
        $.getJSON(
        "https://dev.tescolabs.com/grocery/products/?query="+inputItem+"&offset=0&limit=1&Subscription-Key=774b7555718d47f8b588d6274d0acde0", 
        function(data,status)
        {                   
            $.each(data.uk.ghs.products.results, function(key1, value1)
            {
                //onsole.log(JSON.stringify("Key 1: "+key1));
                //console.log(JSON.stringify("Value 1: "+value1));
                
                if(key1 == i)
                {
                    $.each(value1, function(key2, value2)
                    {                        
                        if(key2=="price")
                        {
                            price = value2 * 1.29;// API returns in £ (*1.29 to exchange to €)
                            price = price.toFixed(2);                                      
                        }
                        else if(key2=="name")
                        {
                            TescoItem = value2;
                        }
                    });
                    i = i + 1;
                }

                $("#input-List").append("<li><div id='listDiv' class='w3-container w3-card-4 w3-light-grey w3-round-xxlarge'><p><b>"+inputItem+"<br>Item: </b>"+TescoItem+"<br><b> Price: &#8364;</b>"+price+"</p><button id='RemoveItem'style='float:right' class='w3-btn w3-red w3-round-xxlarge'>Remove Item</button></div></li>");
                totalPrice = parseFloat(totalPrice) + parseFloat(price);
                refreshTotal();

                var userList = new ShoppingList();
                userList.set("Item", inputItem);
                userList.set("TescoItem", TescoItem);
                userList.set("Price", price);
                userList.set("User", user);

                userList.save// save the input on Parse
                ({
                    success: function()
                    {
                        $("#input-item").val("");
                    }, 
                    error: function(error)
                    {
                        console.log("Parse error:" + error);
                    }
                });
            });
        });
    });
});