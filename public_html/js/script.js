/* 
 * Backbone Model
 */
/* global Backbone, _ */

// used underscore: idAttribute
Backbone.Model.prototype.idAttribute = '_id';

var Blog = Backbone.Model.extend({
   defaults: {
       author: '',
       title: '',
       url:''
   } 
});

// Bakcbone Collection

var Blogs = Backbone.Collection.extend({
    url: 'http://localhost:3000/api/blogs'        
});

// instantiate two Blogs --> test data for test
/* var blog1 = new Blog({
    author: 'Michael',
    title: 'Michael\'s Blog',
    url: 'http://michaelsblog.com'
});

var blog2 = new Blog({
    author: 'John',
    title: 'John\'s Blog',
    url: 'http://johnsblog.com'
});
*/
// instantiate a Collection
// var blogs = new Blogs([blog1, blog2]);  Don't need anymore array because, We can add new item
var blogs = new Blogs();      // 

// Backbone View for one blog

var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function() {
        this.template = _.template($('.blogs-list-template').html());
    },
    // Event edit
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel': 'cancel',
        'click .delete-blog': 'delete'
    },
    // edit function 
    edit: function() {
        $('.edit-blog').hide();
        $('.delete-blog').hide();
//        $('.update-blog').show();
//        $('.cancel').show();
//  used this method for sequentially editing
        this.$('.update-blog').show();
        this.$('.cancel').show();
        
        var author = this.$('.author').html();
        var title = this.$('.title').html();
        var url = this.$('.url').html();
        
        // Activate to edit line
        this.$('.author').html('<input type="text" class="form-control author-update" value="'+ author + '">');
        this.$('.title').html('<input type="text" class="form-control title-update" value="'+ title + '">');
        this.$('.url').html('<input type="text" class="form-control url-update" value="'+ url + '">');
    },
    
    // update function 
    update: function() {
        this.model.set('author', $('.author-update').val());
        this.model.set('title', $('.title-update').val());
        this.model.set('url', $('.url-update').val());
        
        this.model.save(null, {
            success: function(response) {
                console.log('Successfully UPDATED blog with _id: ' + response.toJSON()._id);
            },
            error: function(response) {
                console.log('Failed to update blog!');
            }
        })
    },
    
    // cance function
    cancel: function() {
        blogsView.render();        
    },
    
    // delete line function
    delete: function() {
      this.model.destroy({
          success: function(response) {
              console.log('Successfully DELETED blog with _id: ' + response.toJSON()._id);
           }, 
           error: function() {
               console.log('Failed to DELETE blog!');
           }
      });  
    },
    
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// Backbone View for all Blogs
var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function() {
        var self = this;
        this.model.on('add', this.render, this); // modified this.render() --> this.render ? Result : added new Item
//        this.model.on('change', this.render, this);     // change author input result
        this.model.on('change', function() {
            setTimeout(function() {
                self.render();
            }, 30);  
        }, this);
        // Added code for delete function
        this.model.on('remove', this.render, this);
        
        this.model.fetch({
            success: function(response){
                _.each(response.toJSON(), function(item){
                    console.log('Successfully GOT blog with_id: ' + item._id);
                });
            },
            
            error: function() {
                console.log('Failded to get blogs!');
            }
        });
        
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(blog){
            self.$el.append((new BlogView({model: blog})).render().$el);
        });
        return this;
    }
});

// create new instance for blogview --> result: we can show the list 
var blogsView = new BlogsView();

$(document).ready(function() {
    $('.add-blog').on('click', function() {
        var blog = new Blog({
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val()
        });
        // initialize input command line after imput data
        $('.author-input').val('');
        $('.title-input').val('');
        $('.url-input').val('');
                
        blogs.add(blog);
        
//       console.log(blog.toJSON());
// Define blog.save whether success or fail
        blog.save(null, {
            success: function(response) {
                console.log('Successfully SAVED blog with_id: ' + response.toJSON()._id);
            },
            error: function() {
                console.log('Failed to save blog!');
            }
        });
    });
});