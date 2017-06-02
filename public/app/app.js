'use strict'; 

//Linked List constructor 
var LinkedList = function(){  
  this.head = null;
}
//for adding items to our linked list
LinkedList.prototype.push = function(val){
    var node = {
       value: val,
       next: null
    }
    //for the first node going into the list
    if(!this.head){
      this.head = node;      
    }
    else{
      var current = this.head;
      while(current.next){
        current = current.next;
      }
      current.next = node;
    }
  }
//new list instantiation 
var crunchyList = new LinkedList();

//function to render a blurb 
var renderBlurb = function(blurb){
  if(blurb === null){
    console.log('nothing to render'); 
    $(window).off('scroll' , scrolledToBottom) 
  } else {
    //create components 
    var newBlurb = $('<div>')
      .addClass('blurb'); 

    var article = $('<article>') 
      .attr('id' , blurb.value._id); 

    var header = $('<header>') 
      .addClass('info-header'); 

    var title = $('<h1>') 
      .attr('href' , blurb.value.link)
        .addClass('title')
          .text(blurb.value.title);

    var description = $('<h2>') 
      .addClass('description')
        .text(blurb.value.description); 

    var authorDate = $('<h3>')
      .addClass('author-date')
        .text(blurb.value.author +' '+  blurb.value.postDate); 

    var img = $('<img>')
      .attr('src' , blurb.value.img) 
        .attr('alt' , 'anime'); 

    var articleBody = $('<p>')
      .addClass('article-body')
       .text(blurb.value.body);

    var commentContainer = $('<div>')
      .addClass('comments');

    var expand = $('<i class="fa fa-plus fa-lg"></i>')
      .addClass('expand-btn'); 

       var commentsDropDown = $('<div>')
      .addClass('comment-drop-down')
        .text('Comments ')
          .append(expand); 
            expand.on('click' , function(event){
                commentContainer.toggleClass('active');
                expand.toggleClass('fa fa-plus fa-lg'); 
                expand.toggleClass('fa fa-minus fa-lg');

            })
            
    //function for creating a new comment 
    var appendComment = function(comment){
       var newComment = $('<div>')
            .attr('id' , comment._id)
              .addClass('comment');  

            var commentBody = $('<p>')
              .text(comment.body); 

            var deleteBtn = $('<i class="fa fa-trash-o delete-btn"></i>')
              .on('click' , function(event){
                event.preventDefault(); 
                $.ajax({url:'/comment/delete',method:'DELETE' , data:comment})
                  .done(function(response){
                    newComment.remove();

                  })
              }) 
            //append title and body to the comment
              newComment.append(commentBody);
                commentBody.append(deleteBtn);  
              //append to the commentContainer 
              commentContainer.append(newComment); 
    }

      //loop through blurbs and add them to the commentContainer
      blurb.value.comments.forEach(function(comment){
            appendComment(comment); 
      })

    var postComment = function(event){
            event.preventDefault();
            var data = { 
                body: commentBox.val(), 
                articleRef: blurb.value._id
            }
            $.post({url:'/comment/add' , data:data})
              .done(function(response){
                var addedComment = response.comments[response.comments.length-1]; 
                commentBox.val(''); 
                appendComment(addedComment);

              }) 
      }
  
        //creating inputs for comments 
        var inputContainer = $('<div>')
          .addClass('add-comments')
            .text('Add a comment: ')
              .append('<br>');  

          var commentBox = $('<textarea>')
            .addClass('comment-box')
              .attr('placeholder' , 'comment')
                .on('keyup' , function(event){
                  var key = event.keyCode;
                  var enter = 13; 

                  if(key === enter){
                    postComment(event); 
                  }
                }) 

          var addBtn = $('<button>')
            .text('Add') 
              .addClass('add-btn')
              .on('click' , function(event){
                postComment(event);
              }); 

      //element for linking back to the source document
      var readMore = $('<a>')
        .attr('href' , 'https://www.crunchyroll.com' + blurb.value.link)
          .attr('target' , '_blank') 
           .text(' Read more'); 

      //group components 
      newBlurb.append(article); 
        article.append(header); 
          header.append(title); 
          header.append(description); 
          header.append(authorDate); 
        article.append(img); 
        article.append(articleBody); 
          articleBody.append(readMore);
        article.append(commentsDropDown);
            commentsDropDown.append(commentContainer); 
                  inputContainer.append(commentBox); 
                    inputContainer.append(addBtn);
        article.append(inputContainer); 

      //add the new blurb to the document blurb wrapper
      $('.blurb-wrapper').append(newBlurb);
    }
}
//function to add a blurb to the page 
var addBlurb = function(list ,render){
  //if the current list item is not set then set it to the head. 
  if(!list.current){
    list.current = list.head; 
  }else {
    list.current = list.current.next; 
  }
  //call to renderblurb as a callback
  render(list.current); 
}

//gets the latest articles from the db
$.get('/scrape').done(function(res){
      console.log(res.msg);
      $.get('/latest').done(function(articles){
        articles.forEach(function(article){
         crunchyList.push(article); 
      }); 
    //call to add a blurb for the first article 
    addBlurb(crunchyList, renderBlurb); 
  })
})


//scroll function handler to add a blurb when at the bottom of the page
var scrolledToBottom = function(){
   if($(window).scrollTop() + $(window).height() >= $(document).height()-20) {
        //call to addBlurb to render a new blurb on the page 
        addBlurb(crunchyList, renderBlurb)
   }
}
//setting the scroll event listener on the window to our function handler
$(window).scroll(scrolledToBottom); 
  


