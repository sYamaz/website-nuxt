import sys
import json
import io
import requests
import os

def escape(input:str) -> str:
  return input.replace('\\', '\\\\')\
              .replace('`', '\`')\
              .replace('{', '${"{"}')\
              .replace('}', '${"}"}')\
              .replace('$', '${"$"}')

def Empty() -> str:
  return '{ }'

def Group(grp:dict) -> str:
  if(grp is None):
    return Empty()

  created_at = grp['created_at']
  description = grp['description']
  name = grp['name']
  private = grp['private']
  updated_at = grp['updated_at']
  url_name = grp['url_name']

  arr = []
  arr.append(f'created_at: \'{created_at}\'')
  arr.append(f'description: \'{description}\'')
  arr.append(f'name: \'{name}\'')
  arr.append(f'private: {str(private).lower}')
  arr.append(f'updated_at: \'{updated_at}\'')
  arr.append(f'url_name: \'{url_name}\'')
  return '{' + ',\n'.join(arr) +  '}'

def Tag(tag:dict):
  name = tag['name']
  versions = tag['versions']
  arr = []
  delimiter = ','
  arr.append(f'name: \'{name}\'')
  vals = delimiter.join(map(lambda v: f'\'{v}\'' ,versions))
  arr.append(f'versions: [ {vals} ]')
  return '{' + delimiter.join(arr) + '}'


def Tags(tags):
  tags = map(lambda tag: Tag(tag), tags)
  arr = []
  for tag in tags:
    arr.append(tag)

  return '[' + ','.join(arr) + ']'

def User(user:dict) -> str:
  description = user['description']
  facebook_id = user['facebook_id']
  followees_count = user['followees_count']
  followers_count = user['followers_count']
  github_login_name = user['github_login_name']
  id = user['id']
  items_count = user['items_count']
  linkedin_id = user['linkedin_id']
  location = user['location']
  name = user['name']
  organization = user['organization']
  permanent_id = user['permanent_id']
  profile_image_url = user['profile_image_url']
  team_only = user['team_only']
  twitter_screen_name = user['twitter_screen_name']
  website_url = user['website_url']

  arr = []
  arr.append(f'description: `{description}`')
  arr.append(f'facebook_id: \'{facebook_id}\'')
  arr.append(f'followees_count: {followees_count}')
  arr.append(f'followers_count: {followers_count}')
  arr.append(f'github_login_name: \'{github_login_name}\'')
  arr.append(f'id: \'{id}\'')
  arr.append(f'items_count: {items_count}')
  arr.append(f'linkedin_id: \'{linkedin_id}\'')
  arr.append(f'location: \'{location}\'')
  arr.append(f'name: \'{name}\'')
  arr.append(f'organization: \'{organization}\'')
  arr.append(f'permanent_id: \'{permanent_id}\'')
  arr.append(f'profile_image_url: \'{profile_image_url}\'')
  arr.append(f'team_only: {str(team_only).lower()}')
  arr.append(f'twitter_screen_name: \'{twitter_screen_name}\'')
  arr.append(f'website_url: \'{website_url}\'')

  return '{' + ','.join(arr) + '}'

def TeamMembership(tm:dict) -> str:
  if(tm is None):
    return Empty()

  arr = []
  name = tm['name']
  arr.append(f'name: \'{name}\'')
  return '{' + ','.join(arr) + '}'

def Item(item:dict) -> str:
  arr = []
  rendered_body = escape(item['rendered_body'])
  body = escape(item['body'])
  coediting = item['coediting']
  comments_count = item['comments_count']
  created_at = item['created_at']
  group = Group(item['group']) if 'group' in item else Empty()
  id = item['id']
  likes_count = item['likes_count']
  private = item['private']
  reactions_count = item['reactions_count']
  tags = Tags(item['tags']) if 'tags' in item else '[]'
  title = item['title']
  updated_at = item['updated_at']
  url = item['url']
  user = User(item['user']) if 'user' in item else Empty()
  page_views_count = item['page_views_count']
  team_membership = TeamMembership(item['team_membership']) if 'team_membership' in item else Empty()

  arr.append(f'rendered_body: `{rendered_body}`')
  arr.append(f'body: `{body}`')
  arr.append(f'coediting: {str(coediting).lower()}')
  arr.append(f'comments_count: {comments_count}')
  arr.append(f'created_at: \'{created_at}\'')
  arr.append(f'group: \'{group}\'')
  arr.append(f'id: \'{id}\'')
  arr.append(f'likes_count: {likes_count}')
  arr.append(f'private: {str(private).lower()}')
  arr.append(f'reactions_count: {reactions_count}')
  arr.append(f'tags: {tags}')
  arr.append(f'title: \'{title}\'')
  arr.append(f'updated_at: \'{updated_at}\'')
  arr.append(f'url: \'{url}\'')
  arr.append(f'user: {user}')
  arr.append(f'page_views_count: {"null" if page_views_count is None else page_views_count}')
  arr.append(f'team_membership: {team_membership}')

  return '{' + ','.join(arr) + '}'


def main(out_path):

  response = requests.get('https://qiita.com/api/v2/items?query=user:sYamaz')
  items = json.loads(response.text)

  lines = []
  for item in items:
    it = Item(item)
    lines.append(it)



  text = 'export const articles = [' + ','.join(lines) + ']'
  if os.path.exists(os.path.dirname(out_path)) == False:
    os.makedirs(os.path.dirname(out_path))
  f = io.open(out_path, 'w')
  f.write(text)

if __name__ == '__main__':
  main(sys.argv[1])
