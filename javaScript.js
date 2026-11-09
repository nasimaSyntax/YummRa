
const main = document.querySelector("Main");
const homemenu = document.getElementById("homePage");
const mainContent = main.innerHTML;
const footer = document.getElementById("footer");
const header = document.getElementById("head");
const menu = document.getElementById("menu");
const about = document.getElementById("about");
const contact = document.getElementById("contact");
const cartIcon = document.getElementById("food-cart");
const qty = document.getElementById("qty");
const cartCount = document.querySelector(".cart-count");
//foods menu search
document.addEventListener("click", function(e) {
    const icon = e.target.closest("#searchIcon, #foodSearch");
    if (icon) {
        e.preventDefault();
        const menuSearch = document.querySelector(".menu-search");
        if (menuSearch) {
            menuSearch.classList.toggle("active");
            if (menuSearch.classList.contains("active")) {
                const input = document.getElementById("food-search");
                if (input) input.focus();
            }
        }
    }
});
// foods menu file with it's funtion and categoryBtns 
menu.addEventListener("click", function(e) {
    e.preventDefault();
    fetch("navbar pages/foods menu.html")
    .then(res => res.text())
    .then(detaFood => {
        main.innerHTML = detaFood;
        loadMenuFood("all");
    });
});
// Load foods filtered by category
let menuFoodie = [];
function loadMenuFood(category = "all") {
   const menuContent = document.querySelector(".menu-content");
   if (!menuContent) return;
   fetch("data.json")
   .then(res => res.json())
   .then(deta => {
       menuFoodie = deta;
       let filterFoods;
       if(category === "all" || !category) {
           filterFoods = deta;
       } else {
           // match category case-insensitively
           filterFoods = deta.filter(fod => 
               fod.category && fod.category.toLowerCase() === category.toLowerCase()
           );
       }
       menuContent.innerHTML = filterFoods.map(function(Food) {
           return `
               <div class="food-cart" data-id="${Food.id}">
                 <div class="food-img">
                     <img src="${Food.image}" alt="${Food.name}" class="foodImg">
                     <span class="food-cost">${Food.cost} &euro;</span>
                     <span class="food-heart">
                        <img src="../icons/heart.png" class="foodHeart">
                     </span>
                 </div>
                 <div class="food-info">
                     <h3 class="head-three">${Food.name}</h3>
                     <p>${Food.details}</p>
                     <div class="food-btns">
                        <button type="button" data-id="${Food.id}" class="food-order">Order now<img src="icons/arrow.png"></button>
                        <button type="button" data-id="${Food.id}" class="food-add"><img src="icons/add.png"></button>
                     </div>
                 </div>
              </div>
           `
       }).join("");
   });
}
// Category button filter — delegated for dynamically loaded menu page
document.addEventListener("click", function(e) {
    const cBtn = e.target.closest("[data-category]");
    if (!cBtn) return;
    e.preventDefault();
    const category = cBtn.dataset.category;
    loadMenuFood(category);
});


const foods = JSON.parse(localStorage.getItem("food")) || [];
cartCount.textContent = foods.length;
document.addEventListener("click", function(event) {
    const addBtn = event.target.closest(".food-add");
    if(!addBtn) return;
    const foodCart = addBtn.closest(".food-cart");
    if(!foodCart) return;
    const foodId = foodCart.dataset.id;
    const foodName = foodCart.querySelector(".head-three").textContent;
    const foodPrice = foodCart.querySelector(".food-cost").textContent;
    const foodImg = foodCart.querySelector(".foodImg").src;
     const exist = foods.find(function(f) {
        return f.id == foodId;
     })
     if(exist) {
        exist.quantity++;
     } else {
        foods.unshift({
            id: foodId,
            name: foodName,
            price: foodPrice,
            image: foodImg,
            quantity: 1
        });
     }
    localStorage.setItem("food", JSON.stringify(foods));
    cartCount.textContent = foods.length;
})
const showMsg = document.querySelector(".msg-box");
const emptyCart = document.querySelector(".empty-shop");
const fillCart = document.querySelector(".fill-shop");
cartIcon.addEventListener("click", function(e) {
    e.preventDefault();
    fetch("navbar pages/shop cart.html")
    .then(response => response.text())
    .then(cartData => {
        main.innerHTML = cartData;
        show(foods);
        calculate();
    })
})
function show(foods) {
    const empty = document.querySelector(".empty-shop"); 
    const fill = document.querySelector(".fill-shop"); 
    if(foods.length === 0) {
        empty.style.display = "flex";
        fill.style.display = "none";
    } else {
        empty.style.display = "none";
        fill.style.display = "flex";
        showCart(foods);
    }

}
function showCart(cartfood) {
    const cartBox = document.querySelector(".shop-food")
    cartBox.innerHTML = cartfood.map(function(d) {
            return `
                       <div class="one-food" data-id="${d.id}">
                            <div class="image">
                                <img src="${d.image}">
                                <div class="food-span"><span>${d.name}</span></div>
                            </div>
                            <div class="price">
                                <p><span class="price-number">${d.price}</span></p>
                            </div>
                            <div class="quantity">
                                <button data-id="${d.id}">-</button>
                                <span class="qty">${d.quantity}</span>
                                <button data-id="${d.id}">+</button>
                            </div>
                            <div class="total">
                                <p><span id="completeCost" class="totle">0</span></p>
                            </div>
                            <div class="delet">
                                <img src="../Icons/trash.png" width="25px" ${d.id}>
                            </div>
                        </div>
            
            `;
    }).join("");
}
// cost total
function calculate() {
    const shopfood = document.querySelector(".shop-food");
    if (!shopfood) return;

    let sum = 0;
    shopfood.querySelectorAll(".one-food").forEach(function(food) {
        const price = parseFloat(food.querySelector(".price-number").textContent);
        const quant = Number(food.querySelector(".qty").textContent);
        const result = price * quant;
        sum += result;
        const itemTotal = food.querySelector(".totle");
        if (itemTotal) itemTotal.textContent = result.toFixed(2);
    });

    const total = document.querySelector("#totalCart span");
    if (total) total.textContent = sum.toFixed(2);
}
document.addEventListener("click", function(e) {
    e.preventDefault();
    if(e.target.closest(".footer-links")) {
        const reloadPage = e.target.dataset.page;
        showReloadLinks(reloadPage);
    }
})
function showReloadLinks(links) {
   let address = "";
   if(links === "privacy") address = "navbar pages/privacy policy.html#privacy-policy";
    else if(links === "terms") address = "navbar pages/terms.html#terms-condition";
    else if(links === "feedback") address = "navbar pages/feedback.html#feedback";
    else if(links === "help center") address = "navbar pages/help center.html#FAQ";
     else return;

     fetch(address) 
     .then(res => res.text())
     .then(data => {
        main.innerHTML = data;
     })

}

//Share your experience
const shareMsg = document.getElementById("msg");
const submitShareMsg = document.getElementById("submit-review");
const cancelShareMsg = document.getElementById("cancel-review");
const shareModal = document.querySelector(".modal");
shareMsg.addEventListener("click", function() {
    shareModal.classList.add("active");
})
cancelShareMsg.addEventListener("click", function() {
    shareModal.classList.remove("active");
})
submitShareMsg.addEventListener("click", function() {
    alert("Feild is Empty!");
})
// review btn
const reviewBtn = document.getElementById("reviewBtn");
if (reviewBtn) {
    reviewBtn.addEventListener("click", function() {
        fetch("navbar pages/foods menu.html")
        .then(response => response.text())
        .then(deeta => {
            main.innerHTML = deeta;
            loadMenuFood("all");   // <-- pass "all", not nothing
        });
    });
}
 //contact 
 const contactSec = document.getElementById("contact-page");
 const contactBtn = document.getElementById("contact");

 contactBtn.addEventListener("click", function() {
    fetch("navbar pages/contact.html")
     .then(file => file.text())
     .then(data => {
        main.innerHTML = data;
     })
 })
 //about 
 const aboutSec = document.getElementById("about-content");
 const aboutBtn = document.getElementById("about");
 aboutBtn.addEventListener("click", function() {
    fetch("navbar pages/about.html")
     .then(res => res.text())
     .then(data => {
        main.innerHTML = data;
     })
 })
//review cart
const reviewCart = document.querySelectorAll(".one-cart");
window.addEventListener("scroll", showReview);
function showReview() {
    reviewCart.forEach(function(review, index) {
        const pos = review.getBoundingClientRect().top;
        if(pos< window.innerHeight - 40) {

           setTimeout(function() {
            review.classList.add("show");
           }, index * 100)
        } else {
            review.classList.remove("show")
        }
    });
}
// cart quantity buttons
document.addEventListener("click", function(e) {
    const btn = e.target.closest(".quantity button");
    if (!btn) return;
    const foodEl = btn.closest(".one-food");
    if (!foodEl) return;
    const id = btn.dataset.id;
    const item = foods.find(f => f.id == id);
    if (!item) return;
    if (btn.textContent.trim() === "+") item.quantity++;
    else if (btn.textContent.trim() === "-") item.quantity = Math.max(1, item.quantity - 1);
    localStorage.setItem("food", JSON.stringify(foods));
    const qtyEl = foodEl.querySelector(".qty");
    if (qtyEl) qtyEl.textContent = item.quantity;
    calculate();
});
// delete cart item
document.addEventListener('click', function(e) {
    const del = e.target.closest('.delet');
    if (!del) return;
    const foodEl = del.closest('.one-food');
    if (!foodEl) return;
    const id = foodEl.dataset.id;
    const idx = foods.findIndex(f => f.id == id);
    if (idx > -1) foods.splice(idx, 1);
    localStorage.setItem('food', JSON.stringify(foods));
    foodEl.remove();
    cartCount.textContent = foods.length;
    show(foods);
    calculate();
});
const feedback = document.getElementById("feedback");
const privacy = document.getElementById("privacy");
const terms = document.getElementById("terms");
const helpFAQ = document.getElementById("help");
const orderBtn = document.querySelector(".order-btn");
orderBtn.addEventListener("click", function() {
    fetch("navbar pages/order.html")
    .then(resp => resp.text())
    .then(data => {
        main.innerHTML = data;
        loadOrder();
    })
})

function loadOrder() {
    const orderBox = document.querySelector(".order-box");
    
    fetch("data.json")
    .then(answer => answer.json())
    .then(datas => {
        orderBox.innerHTML = datas.map(function(data) {
            return `
             <div class="order-cart" data-id="${data.id}">
                <div class="order-img">
                   <img src="${data.image}" alt="${data.name}" class="images">
                   <span class="order-cost">${data.cost} &euro;</span>
                   <span class="order-check">
                      <input type="checkbox" class="select-order">
                   </span>
                </div>
                <div class="order-info">
                   <h3>${data.name}</h3>
                   <p>${data.details}</p>
                </div>
             </div>
            `
        });
    })
}
//sign form
const userMenu = document.querySelector(".user-sign");
const userIcon = document.getElementById("user");
const signMenuBtn = document.getElementById("sign-btn");
const signModal = document.querySelector(".signForm");

userIcon.addEventListener("click", function(e) {
    e.stopPropagation();
    userMenu.classList.toggle("show");
});

document.addEventListener("click", function(e) {
    if (
        !userMenu.contains(e.target) &&
        e.target !== userIcon &&
        !userIcon.contains(e.target)
    ) {
        userMenu.classList.remove("show");
    }
});

signMenuBtn.addEventListener("click", function() {
    userMenu.classList.remove("show");
    signModal.style.display = "flex";
});

const closeSignBtn = document.getElementById("closeSign");
        if (closeSignBtn) {
            closeSignBtn.addEventListener("click", function() {
                signModal.style.display = "none";
            });
        }

// Sign up form
const creatBtn = document.getElementById("creat-btn");
const signUpForm = document.getElementById("signUpForm");
const closeSignUp = document.getElementById("closeSignUp");
const toSignin = document.getElementById("to-signin");

if (creatBtn) {
    creatBtn.addEventListener("click", function() {
        userMenu.classList.remove("show");
        signModal.classList.remove("active");
        signUpForm.classList.add("active");
    });
}

const signUpBtn = document.getElementById("sign-up");
if (signUpBtn) {
    signUpBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        signModal.classList.remove("active");
        signUpForm.classList.add("active");
    });
}

if (closeSignUp) {
    closeSignUp.addEventListener("click", function() {
        signUpForm.classList.remove("active");
    });
}

if (toSignin) {
    toSignin.addEventListener("click", function() {
        signUpForm.classList.remove("active");
        signModal.classList.add("active");
    });
}

// Close signup when clicking outside
document.addEventListener("click", function(e) {
    if (signUpForm.classList.contains("active") &&
        !e.target.closest(".signup-modal") &&
        e.target !== creatBtn &&
        e.target.id !== "sign-up") {
        signUpForm.classList.remove("active");
    }
});
// favorite file all code from here start
let favoriteFoods = JSON.parse(localStorage.getItem("favorite")) || [];
const favBox = document.querySelector(".favorite-foodBox");
const redHeart = "icons/fdfd (1).png";
const whiteHeart = "../icons/heart.png";
const favMsg = document.querySelector(".toast");

const favIcon = document.getElementById("fav-icon");
const favPage= document.getElementById("favorite");

if (favIcon) {
    favIcon.addEventListener("click", function() {
        fetch("navbar pages/fav.html")
        .then(res => res.text())
        .then(data => {
            main.innerHTML = data;
            setTimeout(() => renderFood(favoriteFoods), 20);
        });
    });
}
document.addEventListener("click", function(e) {
   const favBtn = e.target.closest(".food-heart, .foodHeart");
   if(!favBtn) return;
   const favCart = favBtn.closest(".food-cart");
   if(!favCart) return;
   const id = favCart.dataset.id;
   const nameEl = favCart.querySelector(".head-three");
   const priceEl = favCart.querySelector(".food-cost");
   const imgEl = favCart.querySelector(".foodImg");
   const name = nameEl ? nameEl.textContent : "Item";
   const price = priceEl ? priceEl.textContent : "";
   const image = imgEl ? imgEl.getAttribute("src") : "";

   const exist = favoriteFoods.find(function(f) {
    return f.id == id;
   });

   let favMsg = document.querySelector(".fav-msg");
   if(!favMsg) {
     favMsg = document.createElement("div");
     favMsg.className = "fav-msg";
     document.body.appendChild(favMsg);
   }
   if(exist) {
    favMsg.textContent = `${name} Before Added!`;
     setTimeout(() => { favMsg.classList.remove("show"); }, 2000);
   } else {
    favoriteFoods.unshift({
        id: id,
        name: name,
        img: image,
        price: price
    });
   }
    
    localStorage.setItem("favorite", JSON.stringify(favoriteFoods));
    favMsg.textContent = `${name} added  to  favorites`;
    favMsg.className = "fav-msg show success";
    setTimeout(() => { favMsg.classList.remove("show"); }, 2000);

   renderFood(favoriteFoods);
});

function renderFood(fav) {
    const favBox = document.querySelector(".favorite-foodBox");
     if(!favBox) return;
    favBox.innerHTML = "";
    if(fav.length === 0) {
        favBox.innerHTML = "<p style='color:#ff8000; text-align:center; padding:2rem; font-size:1.4em;'>No favorite items!</p>";
    } else {
        favBox.innerHTML = fav.map(function(f) {
            return`
                 <div class="fav-cart" data-id="${f.id}">
                        <div class="fav-food-img">
                            <img src="${f.img}" alt="${f.name}" width="250px">
                            <div class="fav-discount">15% OFF</div>
                            <span>
                              <img src="../Icons/fdfd (1).png" class="redbul">
                            </span>
                        </div>
                        <div class="fav-food-info">
                            <h4>${f.name}</h4>
                            <div class="fav-star">
                                <img src="../Icons/star_new-removebg-preview.png" width="18px">
                                <img src="../Icons/star_new-removebg-preview.png" width="18px">
                                <img src="../Icons/star_new-removebg-preview.png" width="18px">
                                <img src="../Icons/star_new-removebg-preview.png" width="18px">
                                <img src="../Icons/star_new-removebg-preview.png" width="18px">
                                <p><span id="fav-star-rate">0</span> /5</p>
                                <p class="review-fav">(<span id="fav-review">164</span>)</p>
                            </div>
                            <div class="fav-cost">
                                <del>35$</del>
                                <ins>${f.price}</ins>
                                <button id="fav-more-btn" type="button" data-id="${f.id}"><img src="../Icons/arrow-right.png" width="28px"></button>
                            </div>
                        </div>
                       </div>
            `
        }).join("");
    }
}
document.addEventListener("click", function(ev) {
    const heartBtn = ev.target.closest(".redbul");
    if(!heartBtn) return;
    const heartFood = heartBtn.closest(".fav-cart");
    if(!heartFood) return;
    const id = heartFood.dataset.id;
    if(!id) return;
    let favItems = JSON.parse(localStorage.getItem("favorite")) || [];
    favItems = favItems.filter(function(foo) {
        return foo.id !== id;
    });
    localStorage.setItem("favorite", JSON.stringify(favItems));
    renderFood(favItems);
})
//book a table 
const bookBtn = document.getElementById("bookTable");
bookBtn.addEventListener("click", function() {
    fetch("book table.html")
    .then(resp => resp.text())
    .then(deta => {
        main.innerHTML = deta;
    }) 
})
let OrderNowFoods = JSON.parse(localStorage.getItem("orderNowFood")) || [];
let selectOrder;
const checkForm = document.querySelector(".check-out-form");
const closeCheckForm = document.getElementById("closeCheck");
document.addEventListener("click", function(check) {
    const checkBtn = check.target.closest("#checkoutBtn");
    if(!checkBtn) return;
    checkForm.style.display = "grid";
    const foods = JSON.parse(localStorage.getItem("food")) || [];
    makeOrderCart(foods);
})

closeCheckForm.addEventListener("click", function() {
    checkForm.style.display = "none";
})
document.addEventListener("click", function(event) {
   const orderNowBtn = event.target.closest(".food-order");
   if(!orderNowBtn) return;
   const orderFood = orderNowBtn.closest(".food-cart");
   if(!orderFood) return;
   const orderId = orderFood.dataset.id;
   const orderName = orderFood.querySelector(".head-three").textContent;
   const orderPrice = orderFood.querySelector(".food-cost").textContent;
   const orderImg = orderFood.querySelector(".foodImg").getAttribute("src");
   selectOrder = {
        id: orderId,
        name: orderName,
        price: orderPrice,
        image: orderImg,
        quantity: 1
   };
   checkForm.style.display ="grid";
   makeOrderCart([selectOrder]);
})

function makeOrderCart(orders) {
    const checkScroll = document.querySelector(".check-scroll");
    if(!checkScroll) return;
    checkScroll.innerHTML = "";
    orders.forEach(function(order) {
        checkScroll.innerHTML += `
         <div class="check-food" data-id="${order.id}">
              <div class="food-imgs">
                 <div class="check-img">
                    <img src="${order.image}">
                 </div>
                 <div class="check-food-name">
                    <h4 class="checkFoodName">${order.name}</h4>
                    <span class="checkFoodCost">${order.price}</span>
                 </div>
              </div>
             <div class="check-quant">
                  <button class="check-less" type="button" data-id="${order.id}">-</button>
                  <span id="check-quantity">${order.quantity}</span>
                  <button class="check-plus" type="button" data-id="${order.id}">+</button>
                  <button type="button" class="check-delete" data-id ="${order.id}"><img src="Icons/x.png"></button>
             </div>
         </div>
        `
    })
    updateQuantity();
}
function updateQuantity() {
    let quant = document.getElementById("check-quantity").textContent;
    let cost = document.querySelector(".checkFoodCost").textContent;
    let costNum = parseFloat(cost);

    let totalCheck = document.getElementById("checkTotal");
    let result = quant * costNum;
    totalCheck.textContent = result;
}
/* document.addEventListener('click', function(d) {
    const checkedFood = d.target.closest(".check-food");
    if(!checkedFood) return;
    const foodQty = checkedFood.querySelector("check-quantity");
    let valueQty = Number(foodQty.textContent);

    if(e.target.contains("check-plus")) {
        valueQty++;
    }
    if(e.target.contains("check-less")) {
        if(valueQty>1) {
            valueQty--;
        }
    }
})*/
// checkout information
const checkName = document.getElementById("check-name");
const checkPhone = document.getElementById("method-phone");
const checkDeliver = document.getElementById("deliver");
const checkPickup = document.getElementById("pickUp");
const checkLocation = document.getElementById("checkAddress");
const checkDate = document.getElementById("methodDate");
const checkTime = document.getElementById("methodTime");
const checkCashPay = document.getElementById("cashPay");
const checkOnlinePay = document.getElementById("onlinePay");
const checkAdditional = document.getElementById("additional");
const placeOrder = document.getElementById("checkOutSubmit");

const allInputs = [
    checkName, checkPhone, checkDeliver, checkPickup, checkLocation, checkDate, checkTime, checkCashPay, checkOnlinePay,checkAdditional
];
placeOrder.addEventListener("click", function(e) {
    e.preventDefault();
    if(checkName.value === "") {
        alert("Enter your name!");
        return;
    }
    if(checkPhone.value === "" ) {
        alert("enter your phone number");
        return;
    }
   placeOrder.textContent = "sending ..";
   setTimeout(function() {
    placeOrder.textContent = "Send";
   }, 5000);
})
//resposive nav menu
const burgerMenu = document.getElementById("burgerMenu");
const navMenu = document.querySelector(".nav-menu");
burgerMenu.addEventListener("click", function() {
    navMenu.classList.toggle("show");
});
document.addEventListener("click", function(e) {
    if (!navMenu || !navMenu.classList.contains("show")) return;

    if (navMenu.contains(e.target) || (burgerMenu && burgerMenu.contains(e.target))) return;

    navMenu.classList.remove("show");
});
const favMenu = document.getElementById("showFavList");
const leftSide = document.querySelector(".leftside");
favMenu.addEventListener("click", function() {
    leftSide.classList.toggle("show");
})
